const express = require('express');
const router = express.Router();
const lineController = require('../controllers/line.controller');

router.get('/', lineController.getAllMetroLines);
router.get('/:id', lineController.getMetroLineById);
router.post('/', lineController.createMetroLine);
router.put('/:id', lineController.updateMetroLine);
router.delete('/:id', lineController.deleteMetroLine);
router.get('/:id/stations', lineController.getStationsByLineId);

module.exports = router;