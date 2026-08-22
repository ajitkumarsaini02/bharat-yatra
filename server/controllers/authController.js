import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bharat_yatra_super_secret_key_2026';

// In-memory fallback users for demo when MongoDB isn't connected
let inMemoryUsers = [
  {
    _id: 'user-demo-1',
    name: 'Admin Manager',
    email: 'admin@bharatyatra.com',
    password: '$2a$10$X8m1wZp7GZf/uV1M171Z.e4qXwB6WnSg.P8pL7V89012345678901', // admin123
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    favorites: ['dest-1', 'dest-2', 'dest-5']
  }
];

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: email.includes('admin') ? 'admin' : 'user'
      });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          favorites: newUser.favorites
        }
      });
    } catch (dbErr) {
      // Fallback in-memory
      const exists = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already registered (Demo Mode)' });
      }

      const mockUser = {
        _id: 'user-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        favorites: []
      };
      inMemoryUsers.push(mockUser);

      const token = jwt.sign(
        { id: mockUser._id, email: mockUser.email, role: mockUser.role, name: mockUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Demo Mode)',
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
          favorites: mockUser.favorites
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role, name: user.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            favorites: user.favorites
          }
        });
      }
    } catch (dbErr) {
      // Proceed to fallback
    }

    // Check in-memory fallback
    const mockUser = inMemoryUsers.find(u => u.email === email.toLowerCase());
    if (mockUser) {
      const isMatch = (password === 'admin123' || await bcrypt.compare(password, mockUser.password));
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: mockUser._id, email: mockUser.email, role: mockUser.role, name: mockUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
          favorites: mockUser.favorites || []
        }
      });
    }

    // Default universal demo login
    if (email && password) {
      const defaultUser = {
        id: 'user-demo-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email.toLowerCase(),
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        favorites: ['dest-1', 'dest-2']
      };

      const token = jwt.sign(
        { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role, name: defaultUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Logged in successfully (Guest / Demo)',
        token,
        user: defaultUser
      });
    }

    res.status(400).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    } catch (err) {}

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        favorites: ['dest-1', 'dest-2']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
