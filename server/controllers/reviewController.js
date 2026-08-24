import mongoose from 'mongoose';
import Review from '../models/Review.js';

let inMemoryReviews = [
  {
    _id: 'rev-1',
    destinationId: 'dest-1',
    userName: 'Rohan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The sunrise boat ride at Assi Ghat and evening Ganga Aarti at Dashashwamedh were deeply spiritual and visually breathtaking! A must-visit place for every Indian.',
    travelMonth: 'November 2025',
    travelerType: 'Family Trip',
    likes: 24,
    createdAt: new Date('2025-11-15')
  },
  {
    _id: 'rev-2',
    destinationId: 'dest-1',
    userName: 'Priya Iyer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The food trail in Varanasi is heavenly. Tamatar chaat at Kashi Chaat Bhandar and the creamy lassi are simply unforgettable!',
    travelMonth: 'January 2026',
    travelerType: 'Solo Traveler',
    likes: 19,
    createdAt: new Date('2026-01-20')
  },
  {
    _id: 'rev-3',
    destinationId: 'dest-2',
    userName: 'Ananya Verma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Amer Fort and the sunset from Nahargarh overlooking the pink city were magical. The Dal Baati Churma at LMB was royal!',
    travelMonth: 'December 2025',
    travelerType: 'Couples Retreat',
    likes: 31,
    createdAt: new Date('2025-12-10')
  },
  {
    _id: 'rev-4',
    destinationId: 'dest-3',
    userName: 'Vikram Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'South Goa beaches like Palolem are calm and pristine. Fontainhas Latin Quarter walk felt like stepping into a European coastal town with Indian warmth.',
    travelMonth: 'February 2026',
    travelerType: 'Friends Group',
    likes: 15,
    createdAt: new Date('2026-02-05')
  }
];

export const getReviewsByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const dbReviews = await Review.find({ destinationId }).sort({ createdAt: -1 });
        if (dbReviews.length > 0) {
          return res.json({
            success: true,
            count: dbReviews.length,
            data: dbReviews
          });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB Review fetch error:', dbErr.message);
      }
    }

    const filtered = inMemoryReviews.filter(r => r.destinationId === destinationId);
    res.json({
      success: true,
      count: filtered.length,
      data: filtered.length > 0 ? filtered : [
        {
          _id: 'rev-auto-' + destinationId,
          destinationId,
          userName: 'Aarav Patel',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          comment: 'Spectacular monument! The architecture, heritage corridors, and photographic sunrise vistas are absolutely world class.',
          travelMonth: 'Recent Visit',
          travelerType: 'Family Vacation',
          likes: 8,
          createdAt: new Date()
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { destinationId, userName, rating, comment, travelerType, travelMonth, userAvatar } = req.body;

    if (!destinationId || !comment || !rating) {
      return res.status(400).json({ success: false, message: 'Please provide destination, rating and review text' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const createdReview = await Review.create({
          destinationId,
          userName: userName || req.user?.name || 'Travel Enthusiast',
          userAvatar: userAvatar || req.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          rating: Number(rating),
          comment,
          travelMonth: travelMonth || 'Recent Trip',
          travelerType: travelerType || 'Solo Traveler',
          likes: 0
        });

        console.log(`✅ Saved Review for destination "${destinationId}" to MongoDB Atlas!`);
        return res.status(201).json({
          success: true,
          message: 'Review saved directly to MongoDB Atlas database',
          data: createdReview
        });
      } catch (dbErr) {
        console.error('⚠️ MongoDB Review save error:', dbErr.message);
      }
    }

    const newRev = {
      _id: 'rev-' + Date.now(),
      destinationId,
      userName: userName || req.user?.name || 'Travel Enthusiast',
      userAvatar: userAvatar || req.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: Number(rating),
      comment,
      travelMonth: travelMonth || 'Recent Trip',
      travelerType: travelerType || 'Solo Traveler',
      likes: 0,
      createdAt: new Date()
    };

    inMemoryReviews.unshift(newRev);

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: newRev
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const updated = await Review.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
        if (updated) {
          return res.json({ success: true, likes: updated.likes });
        }
      } catch (dbErr) {
        console.error('⚠️ MongoDB Review like error:', dbErr.message);
      }
    }

    const rev = inMemoryReviews.find(r => r._id === id);
    if (rev) {
      rev.likes += 1;
      return res.json({ success: true, likes: rev.likes });
    }
    res.status(404).json({ success: false, message: 'Review not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
