const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const UserSession = require("../models/UserSession");
const parser = require("ua-parser-js");

// Hàm tạo Access Token & Refresh Token
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber,email: user.email,
            role: user.role, },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "15m" }
    );

    return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;     
      console.log("Dữ liệu nhận được:", { phoneNumber, password });
  
      if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu!" });
      }
  
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: "Số điện thoại chưa đăng ký!" });
      }
  
      console.log("Dữ liệu người dùng trong DB:", user);
  
      if (!user.password) {
        return res.status(500).json({ message: "Mật khẩu không hợp lệ hoặc chưa được mã hóa!" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu sai!" });
      }
  
      const { accessToken, refreshToken } = generateTokens(user);
  
      await User.updateOne({ _id: user._id }, { refreshToken });
  
      // 🔥 Phân tích thiết bị và IP
      const ua = parser(req.headers["user-agent"]);
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  
      // 🔥 Lưu UserSession
      await UserSession.create({
        userId: user._id,
        refreshToken,
        userAgent: req.headers["user-agent"],
        ip,
        os: ua.os.name + " " + ua.os.version,
        browser: ua.browser.name + " " + ua.browser.version,
        device: ua.device.model || "Unknown",
        lastActiveAt: new Date(),
      });
  
      // 🔥 Đặt refreshToken vào cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",    
        sameSite: "strict",
      });
  
      // 🔥 Trả về response
      res.json({ 
        accessToken, 
        refreshToken, 
        role: user.role, 
        name: user.name, 
        id: user._id.toString()
      });
  
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({ message: "Lỗi server!" });
    }
  };


exports.refreshToken = async (req, res) => {
    try {
        console.log("🛠 Cookies nhận được:", req.cookies);

        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({ message: "Không có Refresh Token!" });
        }

        console.log("🔍 Received JWT:", oldRefreshToken);

        let decoded;
        try {
            decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);
        } catch (err) {
            console.error("❌ Lỗi xác minh token:", err);
            return res.status(403).json({ message: "Refresh Token không hợp lệ!" });
        }

        console.log("✅ Refresh Token hợp lệ:", decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log("❌ Không tìm thấy user!");
            return res.status(403).json({ message: "Refresh Token không hợp lệ!" });
        }

        if (user.refreshToken !== oldRefreshToken) {
            console.log("❌ Refresh Token không khớp với DB!");
            return res.status(403).json({ message: "Refresh Token không hợp lệ!" });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: "15m"}
        );

        await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

        console.log("🎉 Cấp Access Token mới:", newAccessToken);
        console.log("🔄 Cấp Refresh Token mới:", newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        });

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        console.error("🔥 Lỗi server:", error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};


exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(400).json({ message: "Không có Refresh Token!" });
        await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
        res.clearCookie("refreshToken");
        res.json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


exports.googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline"
});

// 🔹 [GET] Xử lý callback từ Google OAuth
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, result, info) => {
    if (err || !result) {
      console.error("Lỗi khi xác thực Google:", err);
      return res.redirect("/login?error=google_auth_failed");
    }
  
    const { user, token } = result;
  
    let existingUser = await User.findOne({ email: user.email });
  
    if (!existingUser) {
      existingUser = await User.create({
        id: user._id,
        email: user.email,
        name: user.name,
        googleId: user.googleId, // lưu đúng cái googleId đã tạo
        avatar: user.avatar || "", // vì user không có `.photos` như profile
        role: "admin",
        signupType: "google",
      });
    }
  
    const { accessToken, refreshToken } = generateTokens(existingUser);
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    });
  
    console.log("🔐 Google Login thành công:", { accessToken, refreshToken });
  
    res.redirect(
      `http://localhost:5713/Admin?token=${accessToken}&name=${encodeURIComponent(existingUser.name)}&role=${existingUser.role}&id=${existingUser._id}`
    );
  })(req, res, next);
  
  };

  exports.getUserSessions = async (req, res) => {
    try {
      const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
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
  
  