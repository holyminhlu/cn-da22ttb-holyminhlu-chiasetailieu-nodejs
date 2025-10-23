const RateTour = require('../models/rateTourModel');
const mongoose = require('mongoose');

// Kết nối tới ToursCheapTripDB để cập nhật average_rating
const toursConnection = mongoose.createConnection('mongodb://localhost:27017/ToursCheapTripDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const tourSchema = new mongoose.Schema({
  tour_id: { type: String, required: true, unique: true },
  average_rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 }
}, { collection: 'ToursCollection' });
const Tour = toursConnection.model('Tour', tourSchema);

exports.createRate = async (req, res) => {
  try {
    const { id_tour, id_user, rate } = req.body;
    console.log('createRate called with:', { id_tour, id_user, rate });
    if (!id_tour || !id_user || !rate) {
      console.log('Missing info:', { id_tour, id_user, rate });
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }
    let rating = await RateTour.findOneAndUpdate(
      { id_tour, id_user },
      { rate },
      { new: true, upsert: true }
    );
    if (!rating) {
      console.log('Failed to save rating');
      return res.status(500).json({ message: 'Không lưu được đánh giá' });
    }
    // Tính lại average_rating và review_count
    const allRatings = await RateTour.find({ id_tour });
    const review_count = allRatings.length;
    const average_rating = review_count > 0 ? (allRatings.reduce((sum, r) => sum + r.rate, 0) / review_count) : 0;
    // Cập nhật sang ToursCollection
    await Tour.findOneAndUpdate(
      { tour_id: id_tour },
      { average_rating, review_count }
    );
    console.log(`Updated average_rating for tour ${id_tour}:`, average_rating, 'review_count:', review_count);
    res.json(rating);
  } catch (err) {
    console.error('Error in createRate:', err);
    res.status(500).json({ message: err.message });
  }
}; 