// intro.model.js
import mongoose from 'mongoose';

const IntroRatingSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  timestamp: { type: Date, default: Date.now }
});

const IntroRating = mongoose.model('IntroRating', IntroRatingSchema);
export default IntroRating;
