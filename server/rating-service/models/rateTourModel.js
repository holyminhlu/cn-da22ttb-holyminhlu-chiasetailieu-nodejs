const mongoose = require('mongoose');

const RateTourSchema = new mongoose.Schema({
  id_tour: { type: String, required: true },
  id_user: { type: String, required: true },
  rate: { type: Number, required: true }
});

module.exports = mongoose.model('RateTour', RateTourSchema, 'RateToursCollection'); 