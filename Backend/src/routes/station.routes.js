const express = require('express');
const router = express.Router();
const stationController = require('../controllers/station.controller');

router.get('/get', stationController.getAllStations);
router.get('/get/:id', stationController.getStationById);
router.post('/create', stationController.createStation); 
router.put('/update/:id', stationController.updateStation); 
router.delete('/delete/:id', stationController.deleteStation); 
router.get('/:id/line', stationController.getStationsByLineId);

module.exports = router;
