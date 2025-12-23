const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const UserSession = require("../models/UserSession");
const parser = require("ua-parser-js");

const authService = require("../services/auth.service");
const logger = require("../utils/logger");
const config = require("../config/config");

exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const { user, accessToken, refreshToken } = await authService.loginUser(phoneNumber, password, userAgent, ip);

    // Cookie settings localhost
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });

     // Cookie settings render luôn HTTPS
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,        // Render luôn HTTPS
      sameSite: "None",    // BẮT BUỘC cross-domain
    });


    res.json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        role: user.role,
        name: user.name,
        id: user._id.toString()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await authService.refreshAuthToken(oldRefreshToken);

    // res.cookie("refreshToken", newRefreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Lax"
    // });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logoutUser(refreshToken);
    // res.clearCookie("refreshToken");
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.json({ status: 'success', message: "Đăng xuất thành công!" });
  } catch (error) {
    next(error);
  }
};


exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  accessType: "offline"
});

// 🔹 [GET] Xử lý callback từ Google OAuth
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err || !user) {
      console.error("Lỗi khi xác thực Google:", err);
      // Determine frontend URL from config/env or hardcode if needed
      return res.redirect(`${process.env.LOCALHOST}/login?error=google_auth_failed`);
    }

    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const { accessToken, refreshToken } = await authService.loginWithGoogle(user, userAgent, ip);

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "Lax"
      // });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      console.log("🔐 Google Login thành công:", { accessToken, refreshToken });

      // Redirect to Frontend with details
      res.redirect(
        `${config.localhost}/?token=${accessToken}&name=${encodeURIComponent(user.name)}&role=${user.role}&id=${user._id}`
      );
    } catch (error) {
      console.error("Google verify error:", error);
      return res.redirect(`${config.localhost}/login?error=server_error`);
    }
  })(req, res, next);

};

exports.getUserSessions = async (req, res) => {
  try {
    // const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        code: 401,
        data: null,
        message: "Không có token!"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        code: 401,
        data: null,
        message: "Không xác định được người dùng."
      });
    }

    const userId = user._id;
    const currentToken = req.cookies?.refreshToken;

    const sessions = await UserSession.find({ userId }).sort({ lastActiveAt: -1 });

    const result = sessions.map((s) => ({
      sessionId: s._id,
      ip: s.ip,
      device: s.device,
      os: s.os,
      browser: s.browser,
      userAgent: s.userAgent,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      isCurrentSession: s.refreshToken === currentToken,
    }));

    res.status(200).json({
      code: 200,
      data: result,
      message: "Lấy phiên thành công"
    });
  } catch (error) {
    console.error("Lỗi khi lấy phiên:", error);
    res.status(500).json({
      code: 500,
      data: null,
      message: "Lỗi server khi lấy phiên đăng nhập!"
    });
  }
};

exports.getMe = (req, res) => {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

