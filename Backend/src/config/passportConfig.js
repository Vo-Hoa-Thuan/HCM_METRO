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
                    // Check if user exists with same email but different provider
                    if (profile.emails?.[0]?.value) {
                         const userWithEmail = await User.findOne({ email: profile.emails[0].value });
                         if (userWithEmail) {
                             // Link account? Or just return error? Or auto-merge?
                             // For now, let's just update the googleId if it's missing, or return that user.
                             user = userWithEmail;
                             if (!user.googleId) {
                                 user.googleId = profile.id;
                                 await user.save();
                             }
                         }
                    }

                    if (!user) {
                        user = new User({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0]?.value || null,
                            signupType: "google", 
                            role: "user", // Default role
                            // avatar: profile.photos?.[0]?.value // schema doesnt have avatar yet? Controller had it.
                        });
                        await user.save();
                    }
                }

                return done(null, user);
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
  