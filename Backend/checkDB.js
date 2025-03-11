const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection error:", err));

// Ví dụ: lấy dữ liệu từ collection `stations`
const Station = mongoose.model('Station', new mongoose.Schema({}, { strict: false }));

Station.find({})
    .then(data => {
        console.log("📌 Dữ liệu trong database:");
        console.log(data);
        mongoose.connection.close();
    })
    .catch(err => console.error("❌ Lỗi khi lấy dữ liệu:", err));
