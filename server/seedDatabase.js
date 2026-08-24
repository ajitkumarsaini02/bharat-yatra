import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/Destination.js';
import { destinationsData } from './data/tourismData.js';

dotenv.config();

export async function seedAllDestinations() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is missing in .env');
      return;
    }

    console.log('Connecting to MongoDB Atlas for monuments seeding...');
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri);
    }
    console.log('Connected to MongoDB Atlas!');

    console.log(`Syncing ${destinationsData.length} monuments and destinations...`);

    let syncedCount = 0;
    for (const d of destinationsData) {
      await Destination.findOneAndUpdate(
        { id: d.id },
        { $set: d },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    const totalInDb = await Destination.countDocuments();
    console.log(`✅ SUCCESS: Synced ${syncedCount} monuments into MongoDB Atlas!`);
    console.log(`📊 Total documents in 'destinations' collection: ${totalInDb}`);
    return totalInDb;
  } catch (error) {
    console.error('❌ Error during destination seeding:', error.message);
    throw error;
  }
}

// Run directly if called as main script
if (process.argv[1]?.includes('seedDatabase.js')) {
  seedAllDestinations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
