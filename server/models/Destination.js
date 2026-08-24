import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  zone: { type: String, required: true },
  category: { type: String, required: true },
  heroImage: { type: String, required: true },
  images: [{ type: String }],
  tagline: { type: String },
  description: { type: String, required: true },
  bestTimeToVisit: { type: String },
  idealDuration: { type: String },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  budgetLevel: { type: String, enum: ['Budget', 'Moderate', 'Luxury'], default: 'Moderate' },
  avgDailyExpense: { type: Number, default: 2000 },
  highlights: [{ type: String }],
  attractions: [{
    name: { type: String },
    type: { type: String },
    entryFee: { type: Number, default: 0 },
    timeNeeded: { type: String }
  }],
  famousFood: [{
    name: { type: String },
    place: { type: String },
    desc: { type: String }
  }],
  shoppingSpecialties: [{ type: String }],
  transportation: {
    nearestAirport: { type: String },
    nearestRailway: { type: String },
    localCommute: { type: String }
  },
  // External API Enriched Metadata & Caching
  wikiData: {
    title: String,
    description: String,
    extract: String,
    wikipediaUrl: String,
    thumbnail: String
  },
  weather: {
    temperature: Number,
    feelsLike: Number,
    humidity: Number,
    windSpeed: Number,
    precipitation: Number,
    weatherCode: Number,
    condition: String,
    description: String,
    icon: String,
    forecast: [{
      date: String,
      dayName: String,
      maxTemp: Number,
      minTemp: Number,
      rainChance: Number,
      weatherCode: Number,
      condition: String,
      icon: String
    }],
    fetchedAt: Date
  },
  heritageData: {
    wikidataId: String,
    isUnescoHeritage: Boolean,
    officialWebsite: String,
    inceptionYear: String
  },
  externalImages: [{ type: String }],
  galleryImages: [{
    title: String,
    imageUrl: String,
    fullUrl: String,
    artist: String,
    license: String
  }],
  nearbyAttractions: [{
    name: String,
    address: String,
    category: String,
    distanceMeters: Number,
    distanceKm: String,
    lat: Number,
    lng: Number,
    website: String,
    openingHours: String
  }],
  externalSources: [{ type: String }],
  lastEnrichedAt: { type: Date },
  weatherFetchedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Destination', destinationSchema);
