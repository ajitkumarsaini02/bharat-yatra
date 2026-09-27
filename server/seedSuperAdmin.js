import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import User from './models/User.js';

dotenv.config();

export const ensureSuperAdmin = async (customPassword = null) => {
  try {
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'ajitkumarsaini875@gmail.com').toLowerCase().trim();

    // Check if Super Admin already exists
    const existingAdmin = await Admin.findOne({ email: superAdminEmail });

    if (existingAdmin && !customPassword) {
      console.log(`👑 Super Admin account (${superAdminEmail}) verified in MongoDB Atlas.`);
      return existingAdmin;
    }

    const passwordToUse = customPassword || process.env.SUPER_ADMIN_PASSWORD || 'Admin@12345';
    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    // Remove any traveler user record with same email to avoid duplicates
    await User.deleteMany({ email: superAdminEmail });

    if (existingAdmin && customPassword) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.department = 'Master Root Architecture';
      await existingAdmin.save();
      console.log(`✅ Super Admin password updated successfully via command.`);
      return existingAdmin;
    }

    const newSuperAdmin = await Admin.create({
      name: 'Primary Super Administrator',
      email: superAdminEmail,
      password: hashedPassword,
      role: 'admin',
      department: 'Master Root Architecture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdBy: 'system',
      createdByName: 'System Auto-Seed',
      createdByEmail: superAdminEmail
    });

    console.log(`🎉 Super Admin account (${superAdminEmail}) initialized in MongoDB Atlas.`);
    return newSuperAdmin;
  } catch (err) {
    console.error('⚠️ Error ensuring Super Admin:', err.message);
  }
};

// Executed directly if called via CLI: `node seedSuperAdmin.js "MyNewPassword"`
if (process.argv[1] && process.argv[1].endsWith('seedSuperAdmin.js')) {
  const customPass = process.argv[2] || null;
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://ajitkumarsaini875@gmail.com';

  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas...');
      await ensureSuperAdmin(customPass);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Connection error:', err.message);
      process.exit(1);
    });
}
