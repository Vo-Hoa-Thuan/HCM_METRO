const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MetroLine = require('./src/models/line.model');
const Station = require('./src/models/station.model');

dotenv.config();

const fs = require('fs');
const logFile = 'lines_log.txt';
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const testGetAllLines = async () => {
    try {
        fs.writeFileSync(logFile, "Starting check...\n");
        await mongoose.connect(process.env.MONGO_URI);
        log("✅ Connected to MongoDB");

        log("Testing getAllMetroLines logic...");
        const lines = await MetroLine.find().populate('stations.station');

        log(`Found ${lines.length} lines.`);

        lines.forEach(line => {
            log(`Line: ${line.name}, Stations: ${line.stations.length}`);
            line.stations.forEach((s, i) => {
                if (!s.station) {
                    log(`❌ ERROR: Station at index ${i} in line ${line.name} is null!`);
                }
            });
        });

        log("✅ Test Completed");
        process.exit(0);

    } catch (error) {
        log("❌ Test Failed: " + error);
        process.exit(1);
    }
};

testGetAllLines();
