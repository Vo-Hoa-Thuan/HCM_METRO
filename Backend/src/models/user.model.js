const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        googleId: { type: String, unique: true, sparse: true }, 
        phoneNumber: { type: String, unique: true, sparse: true }, 
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true, default: null }, 
        password: String, // Chỉ yêu cầu khi đăng ký bằng SĐT
        role: { type: String, enum: ["admin", "user", "staff"], default: "user" },
        refreshToken: { type: String, default: null } // Lưu Refresh Token
    },
    { timestamps: true } 
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
