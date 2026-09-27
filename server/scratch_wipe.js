import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Admin from './models/Admin.js';
import Destination from './models/Destination.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ajitkumarsaini875_db_user:PEH-h-KtA2rU3jK@cluster1.vks5ap2.mongodb.net/bharat_yatra?retryWrites=true&w=majority&appName=Cluster1';

async function wipeUserAndAdminAccounts() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas.');

    // Count before deletion
    const userCountBefore = await User.countDocuments();
    const adminCountBefore = await Admin.countDocuments();
    const destCountBefore = await Destination.countDocuments();

    console.log(`\n📊 BEFORE WIPE:`);
    console.log(`- Users: ${userCountBefore}`);
    console.log(`- Admins: ${adminCountBefore}`);
    console.log(`- Destinations (Protected): ${destCountBefore}`);

    // Wipe Users and Admins collections ONLY
    const userRes = await User.deleteMany({});
    const adminRes = await Admin.deleteMany({});

    // Count after deletion
    const userCountAfter = await User.countDocuments();
    const adminCountAfter = await Admin.countDocuments();
    const destCountAfter = await Destination.countDocuments();

    console.log(`\n✅ WIPE COMPLETE:`);
    console.log(`- Deleted Users: ${userRes.deletedCount} (Remaining: ${userCountAfter})`);
    console.log(`- Deleted Admins: ${adminRes.deletedCount} (Remaining: ${adminCountAfter})`);
    console.log(`- Destinations Safe & Intact: ${destCountAfter}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error wiping accounts:', err.message);
    process.exit(1);
  }
}

wipeUserAndAdminAccounts();
