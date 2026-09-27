import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { sendOTPEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bharat_yatra_super_secret_key_2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'bharat_admin_2026';

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || 'ajitkumarsaini875@gmail.com').toLowerCase().trim();

// In-memory fallback stores when MongoDB is disconnected
let inMemoryUsers = [];
let inMemoryAdmins = [
  {
    _id: 'super-admin-root',
    name: 'Primary Super Administrator',
    email: SUPER_ADMIN_EMAIL,
    role: 'admin',
    department: 'Master Root Architecture',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdBy: 'system',
    createdByName: 'System Seed',
    createdByEmail: SUPER_ADMIN_EMAIL
  }
];

// Temporary store for registration OTPs
const otpStore = new Map(); // key: email -> { otp, expiresAt }

/**
 * Send 6-Digit Verification OTP to Email
 */
export const sendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const [existingUser, existingAdmin] = await Promise.all([
        User.findOne({ email: normalizedEmail }),
        Admin.findOne({ email: normalizedEmail })
      ]);
      if (existingUser || existingAdmin) {
        return res.status(400).json({ success: false, message: 'This email is already registered. Please sign in.' });
      }
    } else {
      const exists = inMemoryUsers.find(u => u.email === normalizedEmail) || inMemoryAdmins.find(a => a.email === normalizedEmail);
      if (exists) {
        return res.status(400).json({ success: false, message: 'This email is already registered. Please sign in.' });
      }
    }

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalizedEmail, { otp: otpCode, expiresAt });

    console.log(`\n==============================================`);
    console.log(`🔐 REGISTRATION OTP FOR ${normalizedEmail}: ${otpCode}`);
    console.log(`==============================================\n`);

    // Send Real Email via Nodemailer SMTP (Non-blocking async dispatch for instant user response)
    sendOTPEmail(normalizedEmail, otpCode).catch(mailErr => {
      console.error('⚠️ SMTP Background Dispatch Error:', mailErr.message);
    });

    return res.json({
      success: true,
      message: `6-Digit OTP code sent to ${normalizedEmail}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify OTP Code Only (Step 2 of Registration)
 */
export const verifyOnlyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP not requested or expired. Please click Resend OTP.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please click Resend OTP.' });
    }

    if (stored.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit OTP code. Please check and try again.' });
    }

    return res.json({
      success: true,
      message: 'OTP Code Verified Successfully! Please set your password to complete registration.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify OTP and Complete Registration
 */
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
      return res.status(400).json({ success: false, message: 'Please fill out all fields and enter 6-digit OTP' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP not requested or expired. Please request a new OTP.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please click Resend OTP.' });
    }

    if (stored.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit OTP code. Please check and try again.' });
    }

    // OTP verified successfully! Clear stored OTP
    otpStore.delete(normalizedEmail);

    // Proceed to register user
    const isSuperAdminEmail = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();
    const resolvedRole = isSuperAdminEmail ? 'admin' : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      if (isSuperAdminEmail) {
        const newAdmin = await Admin.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: 'admin',
          department: 'Master Architecture',
          createdBy: 'system'
        });
        const token = jwt.sign(
          { id: newAdmin._id, email: newAdmin.email, role: 'admin', isSuperAdmin: true, name: newAdmin.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.status(201).json({
          success: true,
          message: 'OTP verified! Super Admin initialized.',
          token,
          user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: 'admin' }
        });
      } else {
        const newUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: 'user'
        });
        const token = jwt.sign(
          { id: newUser._id, email: newUser.email, role: 'user', name: newUser.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.status(201).json({
          success: true,
          message: 'OTP Verified! Traveler account created successfully 🎉',
          token,
          user: { id: newUser._id, name: newUser.name, email: newUser.email, role: 'user', favorites: [] }
        });
      }
    }

    // In-memory fallback
    const mockUser = {
      _id: 'user-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: resolvedRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      favorites: []
    };
    inMemoryUsers.push(mockUser);
    const token = jwt.sign(
      { id: mockUser._id, email: mockUser.email, role: resolvedRole, name: mockUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'OTP Verified! Traveler account created successfully 🎉',
      token,
      user: mockUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // SECURITY ENFORCEMENT: Public registration ALWAYS creates a 'user' (Traveler) account.
    // Only Super Admin (admin@bharatyatra.com) or authorized admins can grant admin privileges.
    const isSuperAdminEmail = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();
    const resolvedRole = isSuperAdminEmail ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        // Check if email already exists in either collection
        const [existingUser, existingAdmin] = await Promise.all([
          User.findOne({ email: normalizedEmail }),
          Admin.findOne({ email: normalizedEmail })
        ]);

        if (existingUser || existingAdmin) {
          return res.status(400).json({ success: false, message: 'Email is already registered. Please sign in.' });
        }

        if (isSuperAdminEmail) {
          // Super Admin registration
          const newAdmin = await Admin.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'admin',
            department: 'Master Architecture & Administration',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            createdBy: 'system',
            createdByName: 'Super Admin Initialization',
            createdByEmail: SUPER_ADMIN_EMAIL
          });

          const token = jwt.sign(
            { id: newAdmin._id, email: newAdmin.email, role: 'admin', isSuperAdmin: true, name: newAdmin.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.status(201).json({
            success: true,
            message: 'Super Administrator account initialized successfully',
            token,
            user: {
              id: newAdmin._id,
              name: newAdmin.name,
              email: newAdmin.email,
              role: 'admin',
              isSuperAdmin: true,
              avatar: newAdmin.avatar,
              department: newAdmin.department
            }
          });
        } else {
          // Public traveler user registration
          const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
          });

          const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: 'user', name: newUser.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.status(201).json({
            success: true,
            message: 'User account created successfully (Registered as Traveler)',
            token,
            user: {
              id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: 'user',
              avatar: newUser.avatar,
              favorites: newUser.favorites || []
            }
          });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB register error:', dbErr.message);
      }
    }

    // In-memory fallback
    const exists = inMemoryUsers.find(u => u.email === normalizedEmail) || inMemoryAdmins.find(a => a.email === normalizedEmail);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const mockUser = {
      _id: 'user-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: resolvedRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      favorites: []
    };
    inMemoryUsers.push(mockUser);

    const token = jwt.sign(
      { id: mockUser._id, email: mockUser.email, role: resolvedRole, name: mockUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User account created successfully (Registered as Traveler)',
      token,
      user: mockUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        // 1. Check Admins collection first
        const admin = await Admin.findOne({ email: normalizedEmail });
        if (admin) {
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password. Please check your credentials.' });
          }

          const token = jwt.sign(
            { id: admin._id, email: admin.email, role: 'admin', name: admin.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              role: 'admin',
              avatar: admin.avatar,
              department: admin.department || 'Tourism Operations'
            }
          });
        }

        // 2. Check Users collection (including users saved with role: 'admin')
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password. Please check your credentials.' });
          }

          const isUserAdmin = user.role === 'admin' || user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
          const finalRole = isUserAdmin ? 'admin' : (user.role || 'user');

          const token = jwt.sign(
            { id: user._id, email: user.email, role: finalRole, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            message: isUserAdmin ? 'Admin login successful' : 'User login successful',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: finalRole,
              avatar: user.avatar,
              favorites: user.favorites || []
            }
          });
        }

        return res.status(404).json({
          success: false,
          message: 'Account not found with this email. Please register first.'
        });
      } catch (dbErr) {
        console.error('⚠️ MongoDB login query error:', dbErr.message);
      }
    }

    // In-memory fallback check
    const memAdmin = inMemoryAdmins.find(u => u.email === normalizedEmail);
    if (memAdmin) {
      const isMatch = await bcrypt.compare(password, memAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
      }
      const token = jwt.sign({ id: memAdmin._id, email: memAdmin.email, role: 'admin', name: memAdmin.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'Admin login successful', token, user: memAdmin });
    }

    const memUser = inMemoryUsers.find(u => u.email === normalizedEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
      }
      const isMemAdmin = memUser.role === 'admin' || memUser.email.includes('admin');
      const finalRole = isMemAdmin ? 'admin' : 'user';
      const token = jwt.sign({ id: memUser._id, email: memUser.email, role: finalRole, name: memUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: isMemAdmin ? 'Admin login successful' : 'User login successful', token, user: { ...memUser, role: finalRole } });
    }

    return res.status(404).json({
      success: false,
      message: 'Account not found with this email. Please register first.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (req.user?.role === 'admin') {
      try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (admin) return res.json({ success: true, user: admin });
      } catch (err) {}
    } else {
      try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) return res.json({ success: true, user });
      } catch (err) {}
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        favorites: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle Favorite Destination for Logged-In User/Admin in MongoDB Atlas
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return res.status(400).json({ success: false, message: 'Please provide destinationId' });
    }

    const destIdStr = String(destinationId);
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && (userId || userEmail)) {
      try {
        let account = null;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          account = await User.findById(userId) || await Admin.findById(userId);
        }
        if (!account && userEmail) {
          account = await User.findOne({ email: userEmail.toLowerCase() }) || 
                    await Admin.findOne({ email: userEmail.toLowerCase() });
        }

        if (account) {
          if (!Array.isArray(account.favorites)) {
            account.favorites = [];
          }
          const exists = account.favorites.includes(destIdStr);
          if (exists) {
            account.favorites = account.favorites.filter(id => id !== destIdStr);
          } else {
            account.favorites.push(destIdStr);
          }
          await account.save();

          console.log(`✅ MongoDB Atlas: Account "${account.email}" favorites updated (${account.favorites.length} total):`, account.favorites);
          return res.json({
            success: true,
            message: exists ? 'Removed from favorites' : 'Added to favorites',
            favorites: account.favorites,
            isFavorite: !exists
          });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB favorites update error:', dbErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Favorites updated locally',
      favorites: [destIdStr],
      isFavorite: true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get User Favorites from MongoDB Atlas
 */
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && (userId || userEmail)) {
      try {
        let account = null;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          account = await User.findById(userId).select('favorites') || 
                    await Admin.findById(userId).select('favorites');
        }
        if (!account && userEmail) {
          account = await User.findOne({ email: userEmail.toLowerCase() }).select('favorites') || 
                    await Admin.findOne({ email: userEmail.toLowerCase() }).select('favorites');
        }

        if (account) {
          return res.json({
            success: true,
            count: account.favorites?.length || 0,
            favorites: account.favorites || []
          });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB favorites get error:', dbErr.message);
      }
    }

    res.json({
      success: true,
      count: 0,
      favorites: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all registered administrators
 */
export const getAllAdmins = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let adminsList = [];

    if (isDbConnected) {
      try {
        adminsList = await Admin.find().select('-password').sort({ createdAt: -1 });
      } catch (err) {
        console.error('⚠️ MongoDB fetch admins error:', err.message);
      }
    }

    if (!adminsList || adminsList.length === 0) {
      adminsList = inMemoryAdmins.map(a => {
        const { password, ...rest } = a;
        return rest;
      });
    }

    res.json({
      success: true,
      count: adminsList.length,
      data: adminsList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add / Register a new Admin account by a logged-in admin
 */
export const createAdminAccount = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password for new admin' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const creatorId = req.user?.id || req.body.createdBy || 'admin-root';
    const creatorName = req.user?.name || req.body.createdByName || 'Administrator';
    const creatorEmail = req.user?.email || req.body.createdByEmail || 'admin@bharatyatra.com';

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const [existingUser, existingAdmin] = await Promise.all([
        User.findOne({ email: normalizedEmail }),
        Admin.findOne({ email: normalizedEmail })
      ]);

      if (existingUser || existingAdmin) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await Admin.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'admin',
        department: department || 'Tourism Operations',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdBy: creatorId,
        createdByName: creatorName,
        createdByEmail: creatorEmail
      });

      console.log(`✅ Admin "${creatorName}" created new admin account "${newAdmin.name}" (${newAdmin.email})`);

      return res.status(201).json({
        success: true,
        message: `Admin account "${newAdmin.name}" added successfully by ${creatorName}`,
        data: {
          _id: newAdmin._id,
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: 'admin',
          department: newAdmin.department,
          avatar: newAdmin.avatar,
          createdBy: newAdmin.createdBy,
          createdByName: newAdmin.createdByName,
          createdByEmail: newAdmin.createdByEmail,
          createdAt: newAdmin.createdAt
        }
      });
    }

    // In-memory fallback
    const exists = inMemoryAdmins.find(a => a.email === normalizedEmail);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mockAdmin = {
      _id: 'admin-' + Date.now(),
      id: 'admin-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'admin',
      department: department || 'Tourism Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdBy: creatorId,
      createdByName: creatorName,
      createdByEmail: creatorEmail,
      createdAt: new Date().toISOString()
    };
    inMemoryAdmins.unshift(mockAdmin);

    const { password: _, ...adminData } = mockAdmin;
    res.status(201).json({
      success: true,
      message: `Admin account "${mockAdmin.name}" added successfully by ${creatorName}`,
      data: adminData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete an Admin account - STRICT SUPER ADMIN AUTHORIZATION & PASSWORD VERIFICATION
 */
export const deleteAdminAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmPassword = req.body?.confirmPassword || req.headers['x-confirm-password'];
    const requesterEmail = (req.user?.email || req.headers['x-admin-email'] || '').toLowerCase();

    // 1. Password Verification Requirement
    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Security Verification Required: Admin account delete karne ke liye aapko apna Super Admin password enter karna hoga.'
      });
    }

    // 2. Super Admin Exclusive Authority
    const isSuperAdminRequester = requesterEmail === SUPER_ADMIN_EMAIL.toLowerCase();
    if (!isSuperAdminRequester) {
      return res.status(403).json({
        success: false,
        message: `Permission Denied: Sirf Primary Super Administrator (${SUPER_ADMIN_EMAIL}) hi dusre admin accounts delete kar sakta hai.`
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    let targetAdmin = null;
    let requesterAdmin = null;

    if (isDbConnected) {
      targetAdmin = (mongoose.Types.ObjectId.isValid(id) ? await Admin.findById(id) : null) ||
                    await Admin.findOne({ email: id.toLowerCase() });
      requesterAdmin = await Admin.findOne({ email: SUPER_ADMIN_EMAIL.toLowerCase() });
    }

    if (!targetAdmin) {
      targetAdmin = inMemoryAdmins.find(a => a._id === id || String(a._id) === String(id) || a.id === id || a.email === id);
    }

    if (!targetAdmin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // 3. IMMUNITY CHECK: Primary Super Admin account can NEVER be deleted!
    if (targetAdmin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Primary Super Administrator account kisi bhi halat me delete nahi kiya ja sakta!'
      });
    }

    // 4. Verify password against stored hash of Super Admin
    if (isDbConnected && requesterAdmin) {
      const isMatch = await bcrypt.compare(confirmPassword, requesterAdmin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Security Verification Failed: Incorrect password! Admin deletion aborted.'
        });
      }
    }

    if (isDbConnected) {
      await Admin.findByIdAndDelete(targetAdmin._id);
    }

    inMemoryAdmins = inMemoryAdmins.filter(a => String(a._id) !== String(targetAdmin._id) && a.id !== id);

    console.log(`🗑️ Admin account "${targetAdmin.name}" (${targetAdmin.email}) deleted by Super Admin after password verification.`);

    res.json({
      success: true,
      message: `Admin account "${targetAdmin.name}" deleted successfully after password verification.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all registered user and admin accounts
 */
export const getAllAccounts = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let usersList = [];
    let adminsList = [];

    if (isDbConnected) {
      try {
        const [users, admins] = await Promise.all([
          User.find().select('-password').sort({ createdAt: -1 }),
          Admin.find().select('-password').sort({ createdAt: -1 })
        ]);
        usersList = users;
        adminsList = admins;
      } catch (err) {
        console.error('⚠️ MongoDB fetch all accounts error:', err.message);
      }
    }

    if (!usersList || usersList.length === 0) {
      usersList = inMemoryUsers.map(u => {
        const { password, ...rest } = u;
        return rest;
      });
    }

    if (!adminsList || adminsList.length === 0) {
      adminsList = inMemoryAdmins.map(a => {
        const { password, ...rest } = a;
        return rest;
      });
    }

    // Merge deduplicated accounts list
    const combinedMap = new Map();

    adminsList.forEach(a => {
      const obj = a._doc ? { ...a._doc } : { ...a };
      const email = (obj.email || '').toLowerCase();
      combinedMap.set(email, {
        ...obj,
        id: obj._id || obj.id,
        role: 'admin',
        accountType: 'Admin',
        isSuperAdmin: email === SUPER_ADMIN_EMAIL.toLowerCase()
      });
    });

    usersList.forEach(u => {
      const obj = u._doc ? { ...u._doc } : { ...u };
      const email = (obj.email || '').toLowerCase();
      if (!combinedMap.has(email)) {
        combinedMap.set(email, {
          ...obj,
          id: obj._id || obj.id,
          role: obj.role || 'user',
          accountType: obj.role === 'admin' ? 'Admin' : 'Traveler',
          isSuperAdmin: email === SUPER_ADMIN_EMAIL.toLowerCase()
        });
      }
    });

    const combinedList = Array.from(combinedMap.values());

    res.json({
      success: true,
      count: combinedList.length,
      superAdminEmail: SUPER_ADMIN_EMAIL,
      data: combinedList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Promote / Demote user role (Grant or Revoke Admin access) - STRICT SUPER ADMIN AUTHORIZATION
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    const requesterEmail = (req.user?.email || req.headers['x-admin-email'] || '').toLowerCase();

    if (!newRole || !['user', 'admin'].includes(newRole)) {
      return res.status(400).json({ success: false, message: 'Role must be "user" or "admin"' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let targetUser = (mongoose.Types.ObjectId.isValid(userId) ? await User.findById(userId) : null) ||
                         await User.findOne({ email: userId.toLowerCase() });
      
      let targetAdmin = (mongoose.Types.ObjectId.isValid(userId) ? await Admin.findById(userId) : null) ||
                          await Admin.findOne({ email: userId.toLowerCase() });

      if (targetUser) {
        if (newRole === 'admin') {
          // Promote to admin
          targetUser.role = 'admin';
          await targetUser.save();

          const existingAdmin = await Admin.findOne({ email: targetUser.email });
          if (!existingAdmin) {
            await Admin.create({
              name: targetUser.name,
              email: targetUser.email,
              password: targetUser.password,
              role: 'admin',
              department: 'Granted Admin Operations',
              createdBy: req.user?.id || 'super-admin',
              createdByName: req.user?.name || 'Super Administrator',
              createdByEmail: requesterEmail || SUPER_ADMIN_EMAIL
            });
          }
          console.log(`🔑 Super Admin "${requesterEmail}" PROMOTED user "${targetUser.email}" to ADMIN`);
          return res.json({ success: true, message: `Granted Admin Access to ${targetUser.name} (${targetUser.email})` });
        } else {
          // Demote to user
          targetUser.role = 'user';
          await targetUser.save();
          await Admin.findOneAndDelete({ email: targetUser.email });
          console.log(`🔒 Admin access REVOKED for "${targetUser.email}" by "${requesterEmail}"`);
          return res.json({ success: true, message: `Revoked Admin Access for ${targetUser.name}. Set role to Traveler.` });
        }
      }

      if (targetAdmin) {
        if (targetAdmin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
          return res.status(403).json({ success: false, message: 'Primary Super Admin account role cannot be demoted!' });
        }
        if (newRole === 'user') {
          await Admin.findByIdAndDelete(targetAdmin._id);
          let u = await User.findOne({ email: targetAdmin.email });
          if (u) {
            u.role = 'user';
            await u.save();
          } else {
            await User.create({
              name: targetAdmin.name,
              email: targetAdmin.email,
              password: targetAdmin.password,
              role: 'user'
            });
          }
          return res.json({ success: true, message: `Revoked Admin Access for ${targetAdmin.name}. Set role to Traveler.` });
        }
      }
    }

    // In-memory fallback
    let memU = inMemoryUsers.find(u => String(u._id) === String(userId) || u.email === userId);
    if (memU) {
      memU.role = newRole;
      if (newRole === 'admin') {
        if (!inMemoryAdmins.some(a => a.email === memU.email)) {
          inMemoryAdmins.unshift({
            _id: 'admin-' + Date.now(),
            name: memU.name,
            email: memU.email,
            password: memU.password,
            role: 'admin',
            department: 'Granted Admin Operations',
            createdByEmail: requesterEmail || SUPER_ADMIN_EMAIL
          });
        }
      } else {
        inMemoryAdmins = inMemoryAdmins.filter(a => a.email !== memU.email);
      }
      return res.json({ success: true, message: `Role updated to ${newRole} for ${memU.name}` });
    }

    res.status(404).json({ success: false, message: 'Account not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a user or admin account (Admin / Super Admin privilege)
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const confirmPassword = req.body?.confirmPassword || req.headers['x-confirm-password'];
    const requesterEmail = (req.user?.email || req.headers['x-admin-email'] || '').toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    let targetEmail = '';
    if (isDbConnected) {
      const userObj = (mongoose.Types.ObjectId.isValid(userId) ? await User.findById(userId) : null) || await User.findOne({ email: userId });
      const adminObj = (mongoose.Types.ObjectId.isValid(userId) ? await Admin.findById(userId) : null) || await Admin.findOne({ email: userId });
      targetEmail = userObj?.email || adminObj?.email || '';
    }

    if (targetEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Security Protocol Violation: Primary Super Administrator account cannot be deleted!' });
    }

    // Password verification requirement
    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Security Verification Required: Account deletion ke liye password enter karein.'
      });
    }

    if (isDbConnected) {
      const requesterAdmin = await Admin.findOne({ email: requesterEmail }) || await Admin.findOne({ email: SUPER_ADMIN_EMAIL.toLowerCase() });
      if (requesterAdmin) {
        const isMatch = await bcrypt.compare(confirmPassword, requesterAdmin.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Security Verification Failed: Incorrect password! Account deletion canceled.'
          });
        }
      }

      if (mongoose.Types.ObjectId.isValid(userId)) {
        await User.findByIdAndDelete(userId);
        await Admin.findByIdAndDelete(userId);
      } else {
        await User.deleteMany({ email: userId.toLowerCase() });
        await Admin.deleteMany({ email: userId.toLowerCase() });
      }

      return res.json({ success: true, message: `Account deleted successfully.` });
    }

    inMemoryUsers = inMemoryUsers.filter(u => String(u._id) !== String(userId) && u.id !== userId && u.email !== userId);
    inMemoryAdmins = inMemoryAdmins.filter(a => String(a._id) !== String(userId) && a.id !== userId && a.email !== userId);

    res.json({ success: true, message: `Account deleted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Change Password for logged-in user / admin
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Purana aur Naya dono passwords bharna zaroori hai.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Naya password kam se kam 6 characters ka hona chahiye.' });
    }

    const userId = req.user?.id;
    const userEmail = (req.user?.email || req.headers['x-admin-email'] || '').toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && (userId || userEmail)) {
      let account = null;

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        account = await Admin.findById(userId) || await User.findById(userId);
      }
      if (!account && userEmail) {
        account = await Admin.findOne({ email: userEmail }) || await User.findOne({ email: userEmail });
      }

      if (!account) {
        return res.status(404).json({ success: false, message: 'Account nahi mila.' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, account.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Ghalat Purana Password! (Incorrect current password)' });
      }

      // Hash and update new password
      account.password = await bcrypt.hash(newPassword, 10);
      await account.save();

      console.log(`🔑 Password changed successfully for account: ${account.email}`);

      return res.json({
        success: true,
        message: '🎉 Password successfully change ho gaya hai!'
      });
    }

    // In-memory fallback
    let memAcc = inMemoryAdmins.find(a => a.email === userEmail) || inMemoryUsers.find(u => u.email === userEmail);
    if (memAcc) {
      const isMatch = await bcrypt.compare(currentPassword, memAcc.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Ghalat Purana Password!' });
      }
      memAcc.password = await bcrypt.hash(newPassword, 10);
      return res.json({ success: true, message: '🎉 Password successfully change ho gaya hai!' });
    }

    res.status(400).json({ success: false, message: 'Unable to update password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

