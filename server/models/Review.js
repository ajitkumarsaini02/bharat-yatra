import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  destinationId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  travelMonth: { type: String },
  travelerType: { type: String, default: 'Solo Traveler' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
