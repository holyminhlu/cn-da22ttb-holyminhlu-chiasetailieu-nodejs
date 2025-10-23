const express = require('express');
const router = express.Router();
const { createRate } = require('../controllers/rateTourController');

router.post('/', createRate);

module.exports = router;