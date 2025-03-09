const express = require('express');
const connectDB = require('./config/db');
const stationRoutes = require('./routes/station.routes');

require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/api', stationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
