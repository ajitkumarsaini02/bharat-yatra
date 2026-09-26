import mongoose from 'mongoose';

const travelSearchSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  fromLocation: { type: String, required: true },
  toDestination: { type: String, required: true },
  travelDate: { type: String, required: true },
  travelersCount: { type: Number, default: 1 },
  hotelNights: { type: Number, default: 1 },
  geographicDistanceKm: { type: Number, required: true },
  roadDistanceKm: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('TravelSearch', travelSearchSchema);
