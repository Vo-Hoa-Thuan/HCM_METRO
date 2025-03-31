const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const EventEmitter = require("events");
const cookieParser = require("cookie-parser"); // 🔥 Thêm cookie-parser

dotenv.config();
mongoose.set("strictQuery", false);

require("./config/passportConfig"); // Cấu hình Passport

const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const authRoutes = require("./routes/auth.routes");
const User = require("./models/user.model");

const app = express();
app.use(express.json());

// 🔥 Thêm cookie-parser để đọc cookies từ request
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:5713", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Tăng giới hạn sự kiện
EventEmitter.defaultMaxListeners = 30;

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Thiếu biến môi trường MONGO_URI");
  process.exit(1);
}

async function removeOldIndexes() {
  const indexes = await User.collection.indexes();
  const emailIndex = indexes.find(index => index.name === "email_1");
  
  if (emailIndex) {
      console.log("🔄 Đang xóa index email_1...");
      await User.collection.dropIndex("email_1");
      console.log("✅ Đã xóa index email_1!");
  }
}

// ✅ Bọc trong async function để đảm bảo kết nối MongoDB trước khi chạy server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");

    // Xóa index cũ nếu tồn tại
    await removeOldIndexes();

    // Sử dụng routes
    app.use("/users", userRoutes);
    app.use("/tickets", ticketRoutes);
    app.use("/auth", authRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
  }
}

startServer();
