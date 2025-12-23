const express = require('express');
const router = express.Router();
const trainController = require('../controllers/train.controller');

// GET /api/trains/realtime
router.get('/realtime', trainController.getRealTimeTrains);

module.exports = router;
