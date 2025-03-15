const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI
// Kết nối MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Sử dụng routes
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
