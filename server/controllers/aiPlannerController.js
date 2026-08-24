import mongoose from 'mongoose';
import Itinerary from '../models/Itinerary.js';
import User from '../models/User.js';
import { destinationsData } from '../data/tourismData.js';

// Comprehensive knowledge base for AI Trip Generation tailored to Indian destinations
const destinationItineraryBlueprints = {
  "varanasi": {
    morningSlots: [
      { time: "05:30 AM - 08:30 AM", title: "Subah-e-Banaras & Sunrise Boat Ride", desc: "Experience the awakening of the holy ghats on a traditional hand-rowed wooden boat from Assi to Manikarnika Ghat with mystical early morning mist and chants.", cost: 350, type: "Spiritual & Photography", tip: "Reach Assi Ghat by 5:15 AM to witness the Yagya and classical morning ragas." },
      { time: "07:00 AM - 09:30 AM", title: "Kashi Vishwanath Corridor & Golden Temple Darshan", desc: "Pass through the sprawling newly built Vishwanath Corridor and take sacred darshan of the Jyotirlinga.", cost: 100, type: "Temple", tip: "Mobile phones and leather belts are not allowed inside; use the official lockers in the corridor." },
      { time: "08:30 AM - 11:30 AM", title: "Sarnath Excursion & Deer Park", desc: "Explore where Lord Buddha delivered his first sermon. Visit Dhamek Stupa, Ashoka Pillar capital, and the Archaeological Museum.", cost: 150, type: "Heritage", tip: "Hire an ASI-certified guide near the ticket counter for authentic Buddhist history." }
    ],
    afternoonSlots: [
      { time: "12:00 PM - 02:00 PM", title: "Kachori Gali & Banarasi Culinary Trail", desc: "Savor Ram Bhandar kachori sabzi, crispy jalebis, and authentic Tamatar Chaat at Kashi Chaat Bhandar.", cost: 300, type: "Food & Culture", tip: "Tamatar chaat is best paired with Palak Patta chaat and Gulab Jamun." },
      { time: "02:30 PM - 05:00 PM", title: "Banarasi Silk Weaving Quarter & Artisan Alleys", desc: "Visit traditional handloom weavers in the Chowk/Madanpura quarters to watch pure Zari Katan silk sarees being crafted on pit-looms.", cost: 0, type: "Crafts & Shopping", tip: "Look for Silk Mark certified stores for authentic pure mulberry silk." },
      { time: "01:30 PM - 04:30 PM", title: "Ramnagar Fort & Vintage Royal Car Museum", desc: "Cross the pontoon/Malviya bridge to visit the 18th-century sandstone fortress of the Kashi Naresh.", cost: 200, type: "History", tip: "Do not miss the ancient astronomical clock and armory display." }
    ],
    eveningSlots: [
      { time: "05:30 PM - 08:00 PM", title: "Grand Maha Ganga Aarti at Dashashwamedh Ghat", desc: "Witness the iconic brass lamp ritual performed by saffron-clad priests amidst conch shells, incense, and thousands of floating diyas.", cost: 200, type: "Spiritual", tip: "Reserve a front-row boat seat by 5:00 PM for the best unhindered photographic view." },
      { time: "08:30 PM - 10:30 PM", title: "Ghats by Night & Banarasi Paan Tasting", desc: "Walk the tranquil illuminated steps of Assi Ghat, listen to live classical sitar at cafes, and conclude with Keshav Tambool paan.", cost: 150, type: "Leisure", tip: "Try the Meetha Paan without tobacco." }
    ]
  },
  "jaipur": {
    morningSlots: [
      { time: "08:00 AM - 12:00 PM", title: "Amer Fort & Sheesh Mahal Exploration", desc: "Scale the hilltop fort overlooking Maota Lake. Marvel at the mirror mosaics of Sheesh Mahal, Ganesh Pol, and Mughal gardens.", cost: 250, type: "Monuments", tip: "Arrive early at 8:00 AM to beat the mid-day heat and large tour buses." },
      { time: "08:30 AM - 11:30 AM", title: "Hawa Mahal Facade & Wind Palace Rooftop Cafes", desc: "Admire the 953 pink honeycomb jharokhas designed for royal ladies, followed by masala chai at Wind View Cafe.", cost: 100, type: "Heritage & Photography", tip: "Morning light illuminates the pink sandstone facade perfectly." },
      { time: "08:00 AM - 11:00 AM", title: "Nahargarh Biological Park & Stepwell (Panna Meena)", desc: "Photograph the geometrically mesmerizing eight-story symmetrical stepwell in Amer village.", cost: 100, type: "Architecture", tip: "Wear comfortable walking shoes with sturdy grip on historic stone stairs." }
    ],
    afternoonSlots: [
      { time: "12:30 PM - 03:00 PM", title: "Royal City Palace Museum & Chandra Mahal", desc: "Explore the courtyards with peacock gates, royal costume gallery, and the world's largest sterling silver vessels.", cost: 350, type: "Palace", tip: "The composite ticket includes City Palace and Jantar Mantar." },
      { time: "01:00 PM - 03:30 PM", title: "Authentic Rajasthani Thali Feast", desc: "Relish an authentic Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and Ghevar meal at Laxmi Mishtan Bhandar (LMB).", cost: 500, type: "Culinary", tip: "Ghee is served lavishly; ask for custom portions if you prefer lighter meals." },
      { time: "03:00 PM - 05:00 PM", title: "Jantar Mantar UNESCO Astronomical Wonders", desc: "Discover the 19 architectural astronomical instruments including the world's largest stone sundial (Vrihat Samrat Yantra).", cost: 100, type: "Science & Heritage", tip: "Look at the shadows on the sundial to calculate exact local solar time." }
    ],
    eveningSlots: [
      { time: "05:00 PM - 07:30 PM", title: "Sunset over Jaipur City from Nahargarh Fort", desc: "Enjoy panoramic views of the entire Pink City skyline glowing amber from Padao Cafe atop the Aravalli hills.", cost: 200, type: "Sightseeing", tip: "Bring a light jacket as hilltop breezes get pleasantly cool after sundown." },
      { time: "07:30 PM - 10:00 PM", title: "Johari & Bapu Bazaar Shopping Trail", desc: "Bargain for Jaipuri bandhani dupattas, lac bangles, blue pottery artifacts, and handcrafted mojari shoes.", cost: 300, type: "Shopping", tip: "Friendly bargaining is expected; standard starting quote can often be negotiated by 25-35%." }
    ]
  },
  "goa": {
    morningSlots: [
      { time: "07:00 AM - 10:30 AM", title: "Palolem Beach Dolphin Spotting & Kayaking", desc: "Paddle through calm turquoise waters or take a silent fishing boat out to spot playful dolphins off Butterfly Island.", cost: 500, type: "Adventure", tip: "Morning waters are the calmest for sea kayaking." },
      { time: "08:30 AM - 11:30 AM", title: "Fontainhas Latin Quarter Architectural Heritage Walk", desc: "Stroll through the pastel Portuguese mansions, tiled azulejo street signs, and quaint heritage bakeries in Panaji.", cost: 100, type: "Heritage", tip: "Try freshly baked Poi and pastéis de nata (custard tarts) at 31st January Bakery." },
      { time: "08:00 AM - 11:30 AM", title: "Aguada Fort & Portuguese Lighthouse", desc: "Explore the 17th-century seaside fortress offering panoramic vistas of the Arabian Sea and Sinquerim beach.", cost: 100, type: "Sightseeing", tip: "Visit the lower fort along the shore for dramatic sea splash photos." }
    ],
    afternoonSlots: [
      { time: "12:30 PM - 03:30 PM", title: "Goan Seafood Shack Feast & Siesta", desc: "Savor Goan Kingfish Thali, Rava Prawns, Crab Xec Xec, and chilled Sol Kadhi with beach shack breezes.", cost: 600, type: "Food", tip: "Sol Kadhi acts as an invigorating natural digestive after rich seafood." },
      { time: "02:00 PM - 05:00 PM", title: "Sahakari Spice Plantation Guided Tour", desc: "Walk through lush vanilla, cardamom, betel nut, and peri-peri plantations with traditional welcome and buffet.", cost: 500, type: "Nature", tip: "Purchase freshly harvested whole black pepper and pure vanilla pods." }
    ],
    eveningSlots: [
      { time: "05:30 PM - 08:00 PM", title: "Sunset at Chapora Fort or Anjuna Beach", desc: "Watch the sun melt into the Arabian sea from the legendary hilltop ramparts with live music in the background.", cost: 100, type: "Leisure", tip: "Arrive 45 minutes before sunset to secure good seating." },
      { time: "08:30 PM - 11:30 PM", title: "Night Flea Market & Live Acoustic Music", desc: "Explore bohemian craft stalls, organic treats, and live coastal bands.", cost: 300, type: "Nightlife & Cultural", tip: "Carry cash as some beachside stalls have patchy digital network coverage." }
    ]
  }
};

// Generic versatile fallback generator for any Indian destination
const generateGenericDaySlots = (destName, dayNum, interests, travelStyle) => {
  const costMultiplier = travelStyle === 'Luxury' ? 2.5 : travelStyle === 'Budget' ? 0.7 : 1.0;

  return {
    morning: [
      {
        time: "07:30 AM - 10:30 AM",
        title: `Iconic Landmark & Cultural Discovery in ${destName}`,
        location: `${destName} Prime Heritage Zone`,
        description: `Begin Day ${dayNum} exploring premier cultural and architectural treasures with refreshing morning climate.`,
        type: interests.includes('Nature') ? 'Nature & Scenic' : 'Heritage & Culture',
        estimatedCost: Math.round(200 * costMultiplier),
        insiderTip: "Start early to capture photos with clean golden hour lighting."
      }
    ],
    afternoon: [
      {
        time: "12:30 PM - 03:30 PM",
        title: `Authentic Regional Culinary Trail & Artisan Guilds`,
        location: `${destName} Traditional Market Quarter`,
        description: `Savor time-honored local specialties followed by visits to recognized GI-tagged craft workshops.`,
        type: 'Food & Crafts',
        estimatedCost: Math.round(450 * costMultiplier),
        insiderTip: "Ask locals for their preferred generational family-run sweet or spice shops."
      }
    ],
    evening: [
      {
        time: "05:30 PM - 08:30 PM",
        title: `Sunset Viewpoint & Evening Bazaar Immersion`,
        location: `${destName} Promenade / Scenic Overlook`,
        description: `Unwind at the most celebrated viewpoint, soak in folk music performances, and explore local shopping promenades.`,
        type: 'Leisure & Sightseeing',
        estimatedCost: Math.round(300 * costMultiplier),
        insiderTip: "Carry cash for small street vendors and artisanal souvenir purchases."
      }
    ]
  };
};

export const generateItinerary = async (req, res) => {
  try {
    const {
      destination = 'Varanasi (Kashi)',
      days = 3,
      travelerType = 'Friends Group', // Solo, Couple, Family, Friends Group
      travelStyle = 'Moderate', // Budget, Moderate, Luxury
      interests = ['Heritage', 'Food', 'Photography'],
      startingCity = 'Delhi'
    } = req.body;

    const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 10);
    const destKey = destination.toLowerCase().includes('varanasi') ? 'varanasi' :
                    destination.toLowerCase().includes('jaipur') ? 'jaipur' :
                    destination.toLowerCase().includes('goa') ? 'goa' : 'generic';

    const blueprint = destinationItineraryBlueprints[destKey];

    // Find destination matching data for real details
    const destMatch = destinationsData.find(d => 
      destination.toLowerCase().includes(d.name.toLowerCase().split(' ')[0])
    ) || destinationsData[0];

    const generatedDays = [];
    let totalEstimatedCost = 0;

    const dayThemes = [
      "Heritage Discovery & Iconic Highlights",
      "Spiritual Trails, Artisan Alleys & Local Flavors",
      "Hidden Gems, Panoramic Views & Sunset Magic",
      "Nature Excursions & Offbeat Countryside",
      "Culinary Masterclasses & Traditional Arts",
      "Adventure Outings & Scenic Escapes",
      "Relaxed Wellness, Souvenirs & Farewell Vistas"
    ];

    for (let i = 1; i <= numDays; i++) {
      let morning, afternoon, evening;

      if (blueprint) {
        morning = [blueprint.morningSlots[(i - 1) % blueprint.morningSlots.length]];
        afternoon = [blueprint.afternoonSlots[(i - 1) % blueprint.afternoonSlots.length]];
        evening = [blueprint.eveningSlots[(i - 1) % blueprint.eveningSlots.length]];
      } else {
        const slots = generateGenericDaySlots(destMatch.name, i, interests, travelStyle);
        morning = slots.morning;
        afternoon = slots.afternoon;
        evening = slots.evening;
      }

      // Calculate daily cost based on style
      const baseDailyStay = travelStyle === 'Luxury' ? 6000 : travelStyle === 'Budget' ? 1200 : 2500;
      const baseDailyFood = travelStyle === 'Luxury' ? 2500 : travelStyle === 'Budget' ? 600 : 1200;
      const baseDailyTransit = travelStyle === 'Luxury' ? 2000 : travelStyle === 'Budget' ? 400 : 900;
      const dailyActivityCost = (morning[0]?.cost || 200) + (afternoon[0]?.cost || 300) + (evening[0]?.cost || 200);

      const dailyTotal = baseDailyStay + baseDailyFood + baseDailyTransit + dailyActivityCost;
      totalEstimatedCost += dailyTotal;

      generatedDays.push({
        day: i,
        theme: `Day ${i}: ${dayThemes[(i - 1) % dayThemes.length]}`,
        morning,
        afternoon,
        evening,
        mealsSuggestion: {
          breakfast: destMatch.famousFood[0] ? `${destMatch.famousFood[0].name} at ${destMatch.famousFood[0].place}` : "Local traditional breakfast",
          lunch: destMatch.famousFood[1] ? `${destMatch.famousFood[1].name} at ${destMatch.famousFood[1].place}` : "Regional authentic thali",
          dinner: destMatch.famousFood[2] ? `${destMatch.famousFood[2].name} at ${destMatch.famousFood[2].place}` : "Signature local dinner"
        },
        dailyEstimatedCost: dailyTotal
      });
    }

    // Cost category breakdown
    const stayCost = Math.round(totalEstimatedCost * 0.40);
    const travelCost = Math.round(totalEstimatedCost * 0.22);
    const foodCost = Math.round(totalEstimatedCost * 0.20);
    const ticketsCost = Math.round(totalEstimatedCost * 0.10);
    const bufferCost = Math.round(totalEstimatedCost * 0.08);

    const generatedItinerary = {
      title: `${numDays}-Day Curated AI Journey in ${destMatch.name}`,
      destination: destMatch.name,
      destinationId: destMatch.id,
      state: destMatch.state,
      durationDays: numDays,
      travelerType,
      travelStyle,
      interests,
      startingCity,
      totalEstimatedCost,
      costBreakdown: {
        stay: stayCost,
        travel: travelCost,
        food: foodCost,
        ticketsAndActivities: ticketsCost,
        shoppingAndBuffer: bufferCost
      },
      days: generatedDays,
      packingChecklist: [
        "Govt photo ID card (Aadhaar / Passport / Voter ID) for entry verification",
        "Comfortable walking shoes / slip-on sandals for temple courtyards",
        "Modest breathable cotton clothing (covering shoulders and knees for religious shrines)",
        "Power bank, multi-plug adapter, and high-speed camera memory cards",
        "Personal medical kit (Electrolytes/ORS, motion sickness tabs, hand sanitizer)",
        "Refillable water bottle & UV sun protection (hat, sunscreen SPF 50)"
      ],
      localTips: [
        `Best time of day to explore outdoor monuments is between 7:00 AM - 10:30 AM and 4:30 PM - 7:00 PM.`,
        `Always remove footwear and maintain silence inside sanctum sanctorums and heritage prayer halls.`,
        `Use authorized prepaid taxi counters at railway stations and airports to avoid inflated fares.`,
        `Keep UPI / digital payment apps active; almost all vendors in India accept QR payments.`,
        `Try local water only from sealed RO / packaged bottles if you have sensitive digestion.`
      ]
    };

    res.json({
      success: true,
      data: generatedItinerary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory fallback for saved itineraries
let inMemorySavedItineraries = [];

/**
 * Save Generated AI Itinerary to MongoDB Atlas
 */
export const saveItinerary = async (req, res) => {
  try {
    const itineraryData = req.body;
    if (!itineraryData || !itineraryData.title || !itineraryData.destination) {
      return res.status(400).json({ success: false, message: 'Invalid itinerary data to save' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const userId = req.user?.id || req.body.userId || null;
        const newItin = await Itinerary.create({
          title: itineraryData.title,
          destination: itineraryData.destination,
          durationDays: itineraryData.durationDays || 3,
          travelerType: itineraryData.travelerType || 'Solo',
          travelStyle: itineraryData.travelStyle || 'Moderate',
          interests: itineraryData.interests || [],
          startingCity: itineraryData.startingCity || 'Delhi',
          totalEstimatedCost: itineraryData.totalEstimatedCost || 0,
          costBreakdown: itineraryData.costBreakdown || {},
          days: itineraryData.days || [],
          packingChecklist: itineraryData.packingChecklist || [],
          localTips: itineraryData.localTips || [],
          createdBy: userId,
          isPublic: true
        });

        // Link to user if logged in
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { savedItineraries: newItin._id }
          });
        }

        console.log(`✅ Saved AI Itinerary "${newItin.title}" to MongoDB Atlas!`);
        return res.status(201).json({
          success: true,
          message: 'Itinerary saved successfully to MongoDB Atlas database',
          data: {
            ...newItin.toObject(),
            id: newItin._id.toString()
          }
        });
      } catch (dbErr) {
        console.error('⚠️ MongoDB Itinerary save error:', dbErr.message);
      }
    }

    // In-Memory Fallback
    const fallbackItin = {
      _id: 'itin-' + Date.now(),
      id: 'itin-' + Date.now(),
      ...itineraryData,
      savedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    inMemorySavedItineraries.unshift(fallbackItin);

    res.status(201).json({
      success: true,
      message: 'Itinerary saved successfully',
      data: fallbackItin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Saved AI Itineraries from MongoDB Atlas
 */
export const getSavedItineraries = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const userId = req.user?.id || req.query.userId;

    if (isDbConnected) {
      try {
        const query = userId ? { createdBy: userId } : {};
        const itins = await Itinerary.find(query).sort({ createdAt: -1 });

        const mapped = itins.map(it => ({
          ...it.toObject(),
          id: it._id.toString(),
          savedAt: it.createdAt
        }));

        return res.json({
          success: true,
          count: mapped.length,
          data: mapped
        });
      } catch (dbErr) {
        console.error('⚠️ MongoDB Itinerary get error:', dbErr.message);
      }
    }

    res.json({
      success: true,
      count: inMemorySavedItineraries.length,
      data: inMemorySavedItineraries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete Saved Itinerary from MongoDB Atlas
 */
export const deleteSavedItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Itinerary.findByIdAndDelete(id);
          if (req.user?.id) {
            await User.findByIdAndUpdate(req.user.id, {
              $pull: { savedItineraries: id }
            });
          }
        }
        return res.json({
          success: true,
          message: 'Itinerary deleted from MongoDB Atlas database'
        });
      } catch (dbErr) {
        console.error('⚠️ MongoDB Itinerary delete error:', dbErr.message);
      }
    }

    inMemorySavedItineraries = inMemorySavedItineraries.filter(it => it.id !== id && it._id !== id);

    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
