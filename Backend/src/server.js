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
const StationRoutes = require("./routes/station.routes"); 
const metroLineRoutes = require('./routes/line.routes');
const feedbackRoutes = require('./routes/feedback.routes');

require("./config/passportConfig");

const app = express();
app.use(express.json());

app.use(cookieParser());


app.use(
  cors({
    origin: process.env.LOCALHOST,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
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

    app.use("/users", userRoutes);
    app.use("/tickets", ticketRoutes);
    app.use("/ticketsPurchased", ticketPurchasedRoutes);
    app.use("/stations", StationRoutes); 
    app.use("/auth", authRoutes);
    app.use('/lines', metroLineRoutes);
    app.use('/feedbacks', feedbackRoutes);
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy trên cổng ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
  }
}

startServer();
