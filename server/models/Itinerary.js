import mongoose from 'mongoose';

const activitySlotSchema = new mongoose.Schema({
  time: String,
  title: String,
  location: String,
  description: String,
  type: String, // Sightseeing, Food, Cultural, Leisure, Transit
  estimatedCost: Number,
  insiderTip: String
});

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  theme: String,
  morning: [activitySlotSchema],
  afternoon: [activitySlotSchema],
  evening: [activitySlotSchema],
  mealsSuggestion: {
    breakfast: String,
    lunch: String,
    dinner: String
  },
  dailyEstimatedCost: Number
});

const itinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  durationDays: { type: Number, required: true },
  travelerType: { type: String, default: 'Solo' },
  travelStyle: { type: String, default: 'Moderate' },
  interests: [{ type: String }],
  startingCity: { type: String, default: 'Delhi' },
  totalEstimatedCost: { type: Number },
  costBreakdown: {
    stay: Number,
    travel: Number,
    food: Number,
    ticketsAndActivities: Number,
    shoppingAndBuffer: Number
  },
  days: [dayPlanSchema],
  packingChecklist: [{ type: String }],
  localTips: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
