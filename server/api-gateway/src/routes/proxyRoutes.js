const express = require('express');
const router = express.Router();

const toursProxy = require('./toursProxy');
const authProxy = require('./authProxy');
 const bookingProxy = require('./bookingProxy'); // Đã mount ở index.js, không cần ở đây
const discountsProxy = require('./discountsProxy');
const ratingProxy = require('./ratingProxy');
const documentsProxy = require('./documentsProxy');
const coursesProxy = require('./coursesProxy');
const forumProxy = require('./forumProxy');
const paymentsProxy = require('./paymentsProxy');
const sepayIPNProxy = require('./sepayIPNProxy');

// Debug middleware để log routes
router.use((req, res, next) => {
  console.log(`\n🔍 Router received: ${req.method} ${req.path} (original: ${req.originalUrl})`);
  next();
});

router.use('/auth', (req, res, next) => {
  console.log(`🔗 Routing to authProxy: ${req.method} ${req.path}`);
  next();
}, authProxy);

router.use('/tours', toursProxy);

router.use('/bookings', bookingProxy); // Đã mount ở index.js, không cần ở đây

router.use('/discounts', discountsProxy);

router.use('/rating', ratingProxy);

router.use('/documents', (req, res, next) => {
  console.log(`🔗 Routing to documentsProxy: ${req.method} ${req.path}`);
  next();
}, documentsProxy);

router.use('/courses', (req, res, next) => {
  console.log(`🔗 Routing to coursesProxy: ${req.method} ${req.path}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  console.log(`   Request path: ${req.path}`);
  console.log(`   Request URL: ${req.url}`);
  next();
}, coursesProxy);

router.use('/forum', (req, res, next) => {
  console.log(`🔗 Routing to forumProxy: ${req.method} ${req.path}`);
  next();
}, forumProxy);

router.use('/payments', (req, res, next) => {
  console.log(`🔗 Routing to paymentsProxy: ${req.method} ${req.path}`);
  next();
}, paymentsProxy);

// SePay IPN endpoint - Route chuyên dụng cho SePay IPN callback
router.use('/payment/sepay/ipn', (req, res, next) => {
  console.log(`📨 Routing to SePay IPN Proxy: ${req.method} ${req.path}`);
  next();
}, sepayIPNProxy);

module.exports = router;
