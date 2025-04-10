const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    os: { type: String },
    browser: { type: String },
    device: { type: String },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserSession = mongoose.models.UserSession || mongoose.model("UserSession", userSessionSchema);
module.exports = UserSession;
