import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  permissions: {
    type: [String],
    default: ['destinations:read', 'destinations:write', 'destinations:delete', 'enrichment:manage']
  },
  department: {
    type: String,
    default: 'Tourism Operations & Content'
  },
  favorites: [{
    type: String
  }],
  savedItineraries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  }]
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
