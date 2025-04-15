require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || null,
                        verified: true,
                    });

                    await user.save();
                } else {
                    console.log("Người dùng đã tồn tại -> Đăng nhập");
                }

                // 🔹 Tạo token JWT
                const token = jwt.sign(
                    { userId: user._id }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: "7d" }
                );

                return done(null, { user, token });
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// passport.serializeUser((data, done) => {
//     done(null, data.user._id); // chỉ lưu _id vào session
//   });
  
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   });
  