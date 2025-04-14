// intro.controller.js
import IntroRating from '../models/intro.model.js';

export const submitRating = async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const existing = await IntroRating.findOne({
      ip,
      timestamp: { $gt: new Date(Date.now() - 15 * 60 * 1000) }
    });

    if (existing) {
      return res.status(429).json({ message: 'You can only rate once every 15 minutes.' });
    }

    const newRating = await IntroRating.create({ ip, rating });
    res.status(201).json({ message: 'Rating submitted.', data: newRating });
  } catch (error) {
    console.error('Rating submission failed:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const result = await IntroRating.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);
    if (!result.length) return res.json({ average: 0, count: 0 });
    res.json({ average: result[0].average, count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate average.' });
  }
};

export const deleteAllRatings = async (req, res) => {
  try {
    await IntroRating.deleteMany({});
    res.status(200).json({ message: 'All ratings cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear ratings.' });
  }
};