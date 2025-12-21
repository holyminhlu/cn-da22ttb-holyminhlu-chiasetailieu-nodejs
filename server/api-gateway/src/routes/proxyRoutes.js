const express = require('express');
const router = express.Router();

const toursProxy = require('./toursProxy');
const authProxy = require('./authProxy');
const adminProxy = require('./adminProxy');
 const bookingProxy = require('./bookingProxy'); // Đã mount ở index.js, không cần ở đây
const discountsProxy = require('./discountsProxy');
const ratingProxy = require('./ratingProxy');
const documentsProxy = require('./documentsProxy');
const coursesProxy = require('./coursesProxy');
const forumProxy = require('./forumProxy');
const paymentsProxy = require('./paymentsProxy');
const blogsProxy = require('./blogsProxy');

// Debug middleware để log routes
router.use((req, res, next) => {
  console.log(`\n🔍 Router received: ${req.method} ${req.path} (original: ${req.originalUrl})`);
  next();
});

// Admin routes - MUST be before /auth to avoid conflicts
// Express matches routes in order, so /admin must come before /auth
router.use('/admin', (req, res, next) => {
  console.log(`\n🔐 ========== ADMIN ROUTE MATCHED ==========`);
  console.log(`Path: ${req.path}`);
  console.log(`Original URL: ${req.originalUrl}`);
  console.log(`Routing to adminProxy...`);
  console.log(`==========================================\n`);
  next();
}, adminProxy);

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

router.use('/blogs', (req, res, next) => {
  console.log(`🔗 Routing to blogsProxy: ${req.method} ${req.path}`);
  next();
}, blogsProxy);

module.exports = router;
