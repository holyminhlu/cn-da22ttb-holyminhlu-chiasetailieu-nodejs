const express = require('express');
const router = express.Router();

const toursProxy = require('./toursProxy');
const authProxy = require('./authProxy');
 const bookingProxy = require('./bookingProxy'); // Đã mount ở index.js, không cần ở đây
const discountsProxy = require('./discountsProxy');
const ratingProxy = require('./ratingProxy');
const documentsProxy = require('./documentsProxy');
const coursesProxy = require('./coursesProxy');

// Debug middleware để log routes
router.use((req, res, next) => {
  console.log(`\n🔍 Router received: ${req.method} ${req.path} (original: ${req.originalUrl})`);
  next();
});

router.use('/auth', authProxy);         // ✅ Dùng biến đã require
router.use('/tours', toursProxy);
router.use('/bookings', bookingProxy); // Đã mount ở index.js, không cần ở đây
router.use('/discounts', discountsProxy);
router.use('/rating', ratingProxy);
router.use('/documents', documentsProxy); // ✅ Documents service proxy
router.use('/courses', coursesProxy); // ✅ Courses service proxy

module.exports = router;
