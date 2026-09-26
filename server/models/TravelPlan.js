import mongoose from 'mongoose';

const travelPlanSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  travelDate: { type: String, required: true },
  returnDate: { type: String, default: null },
  travellers: { type: Number, default: 1 },
  mode: { type: String, enum: ['train', 'bus', 'flight', 'all'], required: true },
  provider: { type: String, required: true },
  transportId: { type: String, default: '' },
  operator: { type: String, default: '' },
  providerFare: { type: Number, default: null },
  estimatedFare: { type: Number, default: null },
  currency: { type: String, default: 'INR' },
  selectedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('TravelPlan', travelPlanSchema);
