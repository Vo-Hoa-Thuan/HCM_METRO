const express = require('express');
const router = express.Router();
const lineController = require('../controllers/line.controller');
const { authenticateToken } = require('../middleware/auth');

// Public routes
// Public routes
router.get('/', lineController.getAllMetroLines);
router.get('/search', lineController.searchRoutes);
router.get('/:id', lineController.getMetroLineById);
router.get('/:lineId/stations', lineController.getStationsByLineId);

// Protected routes
router.post('/', authenticateToken, lineController.createMetroLine);
router.put('/:id', authenticateToken, lineController.updateMetroLine);
router.delete('/:id', authenticateToken, lineController.deleteMetroLine);

module.exports = router;