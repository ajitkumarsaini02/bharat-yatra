import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bharat_yatra_super_secret_key_2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'bharat_admin_2026';

// In-memory fallback stores when MongoDB is disconnected
let inMemoryUsers = [];
let inMemoryAdmins = [];

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user', adminSecretKey } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let resolvedRole = role === 'admin' ? 'admin' : 'user';
    if (normalizedEmail.includes('admin')) {
      resolvedRole = 'admin';
    }

    // If registering as admin, validate passcode
    if (resolvedRole === 'admin' && adminSecretKey && adminSecretKey.trim() !== '' && adminSecretKey !== ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid Admin Secret Key. Access denied.' });
    }

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

        if (resolvedRole === 'admin') {
          // Save in 'admins' collection
          const newAdmin = await Admin.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          });

          const token = jwt.sign(
            { id: newAdmin._id, email: newAdmin.email, role: 'admin', name: newAdmin.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.status(201).json({
            success: true,
            message: 'Admin account created successfully (Saved to MongoDB admins table)',
            token,
            user: {
              id: newAdmin._id,
              name: newAdmin.name,
              email: newAdmin.email,
              role: 'admin',
              avatar: newAdmin.avatar,
              department: newAdmin.department
            }
          });
        } else {
          // Save in 'users' collection
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
            message: 'User account created successfully (Saved to MongoDB users table)',
            token,
            user: {
              id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: 'user',
              avatar: newUser.avatar,
              favorites: newUser.favorites
            }
          });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB register error:', dbErr.message);
      }
    }

    // In-memory fallback
    if (resolvedRole === 'admin') {
      const exists = inMemoryAdmins.find(u => u.email === normalizedEmail);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const mockAdmin = {
        _id: 'admin-' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      inMemoryAdmins.push(mockAdmin);

      const token = jwt.sign(
        { id: mockAdmin._id, email: mockAdmin.email, role: 'admin', name: mockAdmin.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Admin account created successfully',
        token,
        user: mockAdmin
      });
    } else {
      const exists = inMemoryUsers.find(u => u.email === normalizedEmail);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const mockUser = {
        _id: 'user-' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        favorites: []
      };
      inMemoryUsers.push(mockUser);

      const token = jwt.sign(
        { id: mockUser._id, email: mockUser.email, role: 'user', name: mockUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User account created successfully',
        token,
        user: mockUser
      });
    }
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
        // If specifically signing in as Admin
        if (role === 'admin' || normalizedEmail.includes('admin')) {
          const admin = await Admin.findOne({ email: normalizedEmail });
          if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
              return res.status(400).json({ success: false, message: 'Invalid Admin password. Please check your credentials.' });
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
                department: admin.department
              }
            });
          }

          if (role === 'admin') {
            return res.status(404).json({
              success: false,
              message: 'Admin account not found with this email. Please register as Admin first.'
            });
          }
        }

        // Check Users collection
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password. Please check your credentials.' });
          }

          const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role || 'user', name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            message: 'User login successful',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role || 'user',
              avatar: user.avatar,
              favorites: user.favorites || []
            }
          });
        }

        // If not found in User, check Admin as fallback
        const adminFallback = await Admin.findOne({ email: normalizedEmail });
        if (adminFallback) {
          const isMatch = await bcrypt.compare(password, adminFallback.password);
          if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password. Please check your credentials.' });
          }

          const token = jwt.sign(
            { id: adminFallback._id, email: adminFallback.email, role: 'admin', name: adminFallback.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
              id: adminFallback._id,
              name: adminFallback.name,
              email: adminFallback.email,
              role: 'admin',
              avatar: adminFallback.avatar,
              department: adminFallback.department
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

    // In-memory check
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
      const token = jwt.sign({ id: memUser._id, email: memUser.email, role: 'user', name: memUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'User login successful', token, user: memUser });
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
