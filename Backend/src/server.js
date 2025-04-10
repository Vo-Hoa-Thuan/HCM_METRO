const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const EventEmitter = require("events");
const connectDB = require("./config/db");

dotenv.config(); 

const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const ticketPurchasedRoutes = require("./routes/ticketPurchased.routes");
const authRoutes = require("./routes/auth.routes");

// Cấu hình passport
require("./config/passportConfig");

const app = express();
app.use(express.json());

// Sử dụng cookie-parser để đọc cookies từ request
app.use(cookieParser());

// CORS - Cấu hình để cho phép ứng dụng frontend kết nối với backend
app.use(
  cors({
    origin: process.env.LOCALHOST, // Địa chỉ frontend của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Cấu hình session để duy trì trạng thái đăng nhập
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret", // Mã bảo mật cho session
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

EventEmitter.defaultMaxListeners = 30;

async function startServer() {
  try {
    await connectDB();
    console.log("✅ Kết nối MongoDB thành công");

    // Sử dụng các route cho API
    app.use("/users", userRoutes);
    app.use("/tickets", ticketRoutes);
    app.use("/ticketsPurchased", ticketPurchasedRoutes);
    app.use("/auth", authRoutes);

    // Cấu hình cổng cho server
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy trên cổng ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
  }
}

// Khởi động server
startServer();
