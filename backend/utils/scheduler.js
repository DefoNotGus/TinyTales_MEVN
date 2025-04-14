// scheduler.js
import cron from 'node-cron';
import IntroRating from '../models/intro.model.js';

// ⏰ Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Calculate average rating
    const result = await IntroRating.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    const avgRating = result.length ? result[0].average : 0;

    // Delete existing ratings
    await IntroRating.deleteMany({});

    // Submit 5 new ratings with fake IPs based on the average
    const fakeRatings = [];
    for (let i = 1; i <= 5; i++) {
      fakeRatings.push({ ip: `fakeip${i}`, rating: Math.round(avgRating) });
    }
    await IntroRating.insertMany(fakeRatings);

    console.log(`🧹 Cleared intro ratings and submitted 5 fake ratings (avg: ${avgRating.toFixed(2)}) at ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('❌ Failed to clear intro ratings and submit fake ratings:', error.message);
  }
});