const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const EventEmitter = require("events");
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require("./config/db");
const config = require('./config/config');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const authRoutes = require("./routes/auth.routes");
const StationRoutes = require("./routes/station.routes");
const metroLineRoutes = require('./routes/line.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const newRoutes = require('./routes/new.routes');
const progressRoutes = require('./routes/progress.routes');
const vnpayRoutes = require('./routes/vnpay.routes');
const orderRoutes = require('./routes/payment.routes');
const trainRoutes = require('./routes/train.routes');

require("./config/passportConfig");

const app = express();

// DEBUG LOGGING
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Security Middleware
// app.use(helmet());
app.use(compression());

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: config.localhost,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: config.sessionSecret || "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

EventEmitter.defaultMaxListeners = 30;

// Routes
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use("/stations", StationRoutes);
app.use("/auth", authRoutes);
app.use('/lines', metroLineRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/news', newRoutes);
app.use('/progress', progressRoutes);
app.use("/vnpay", vnpayRoutes);
app.use("/order", orderRoutes);
app.use("/trains", trainRoutes);

// Global Error Handler (Must be last)
app.use(errorHandler);

// Database connection helper for Vercel
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await connectDB();
    isConnected = true;
    logger.info("✅ Kết nối MongoDB thành công");
  } catch (err) {
    logger.error("❌ Lỗi kết nối MongoDB:", err);
  }
};

// Middleware to ensure DB is connected on every request (for Serverless)
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = config.port || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Server chạy trên cổng ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;

