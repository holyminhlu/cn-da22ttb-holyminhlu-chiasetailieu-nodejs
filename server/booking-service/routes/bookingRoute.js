const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route để tạo một booking mới
router.post('/', bookingController.createBooking);

// Route để lấy booking theo email người dùng
router.get('/:email', bookingController.getBookingsByEmail);

module.exports = router;
