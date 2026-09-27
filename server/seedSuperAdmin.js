import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import User from './models/User.js';

dotenv.config();

export const ensureSuperAdmin = async (customPassword = null) => {
  try {
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'ajitkumarsaini875@gmail.com').toLowerCase().trim();
    const passwordToUse = customPassword || process.env.SUPER_ADMIN_PASSWORD || 'Admin@12345';

    // Remove any user account registered with this email to avoid duplicates
    await User.deleteMany({ email: superAdminEmail });

    const existingAdmin = await Admin.findOne({ email: superAdminEmail });

    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.department = 'Master Root Architecture';
      await existingAdmin.save();
      console.log(`\n======================================================`);
      console.log(`👑 SUPER ADMIN ACCOUNT UPDATED IN MONGODB ATLAS!`);
      console.log(`📧 Email:    ${superAdminEmail}`);
      console.log(`🔑 Password: ${passwordToUse}`);
      console.log(`======================================================\n`);
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

    console.log(`\n======================================================`);
    console.log(`🎉 SUPER ADMIN CREATED IN MONGODB ATLAS!`);
    console.log(`📧 Email:    ${superAdminEmail}`);
    console.log(`🔑 Password: ${passwordToUse}`);
    console.log(`======================================================\n`);

    return newSuperAdmin;
  } catch (err) {
    console.error('⚠️ Error ensuring Super Admin:', err.message);
  }
};

// Executed directly if called via CLI: `node seedSuperAdmin.js`
if (process.argv[1] && process.argv[1].endsWith('seedSuperAdmin.js')) {
  const customPass = process.argv[2] || 'Admin@12345';
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://ajitkumarsaini875_db_user:PEH-h-KtA2rU3jK@cluster1.vks5ap2.mongodb.net/bharat_yatra?retryWrites=true&w=majority&appName=Cluster1';

  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas for Super Admin seeding...');
      await ensureSuperAdmin(customPass);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Connection error:', err.message);
      process.exit(1);
    });
}
