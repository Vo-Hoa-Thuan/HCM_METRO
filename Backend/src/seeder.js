const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Station = require('./models/Station');

connectDB();

const stations = [
    { name: "Ga Bến Thành", location: "Quận 1" },
    { name: "Ga Suối Tiên", location: "Quận 9" },
];

const importData = async () => {
    try {
        await Station.deleteMany();
        await Station.insertMany(stations);
        console.log("✅ Data Imported Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Data Import Failed:", error);
        process.exit(1);
    }
};

importData();
