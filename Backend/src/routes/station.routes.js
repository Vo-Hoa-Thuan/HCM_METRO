const express = require('express');
const Station = require('../models/station.model');

const router = express.Router();

router.get('/stations', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching stations" });
    }
});

module.exports = router;
