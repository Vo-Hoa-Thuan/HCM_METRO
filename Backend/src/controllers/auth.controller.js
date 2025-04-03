const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// Hàm tạo Access Token & Refresh Token
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "10s" }
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

      // Kiểm tra mật khẩu đã hash chưa
      if (!user.password) {
          return res.status(500).json({ message: "Mật khẩu không hợp lệ hoặc chưa được mã hóa!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Mật khẩu sai!" });
      }

      // Tạo token mới
      const { accessToken, refreshToken } = generateTokens(user);
      await User.updateOne({ _id: user._id }, { refreshToken });


      // Lưu refreshToken vào cookie
      res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",    
          sameSite: "strict"
      });

      res.json({ accessToken, refreshToken , role: user.role});

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

        // Xác minh Refresh Token
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

        // Tạo Access Token mới
        const newAccessToken = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: "10s" }
        );

        // 🔄 **Cấp Refresh Token mới** (không dùng lại token cũ)
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_SECRET,
            { expiresIn: "10s" }
        );

        // 📝 **Cập nhật refreshToken trong database**
        await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

        console.log("🎉 Cấp Access Token mới:", newAccessToken);
        console.log("🔄 Cấp Refresh Token mới:", newRefreshToken);

        // ✅ **Gửi lại Refresh Token mới qua cookie**
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

// 🔹 [POST] Đăng xuất
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(400).json({ message: "Không có Refresh Token!" });

        // Tìm user & xóa refreshToken
        await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });

        // Xóa cookie
        res.clearCookie("refreshToken");
        res.json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// 🔹 [GET] Xử lý đăng nhập Google OAuth
exports.googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
    accessType: "offline"
});

// 🔹 [GET] Xử lý callback từ Google OAuth
exports.googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
        if (err || !user) {
            console.error("Lỗi khi xác thực Google:", err);
            return res.redirect("/login?error=google_auth_failed");
        }

        // Kiểm tra user đã tồn tại trong DB chưa
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
            existingUser = await User.create({
                email: user.email,
                fullName: user.displayName,
                googleId: user.id,
                avatar: user.photos[0].value
            });
        }

        // Tạo Access Token & Refresh Token
        const { accessToken, refreshToken } = generateTokens(existingUser);

        // Lưu Refresh Token vào HttpOnly Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Lax"
        });

        console.log("🔐 Google Login thành công:", { accessToken, refreshToken });

        // Chuyển hướng về trang Admin
        res.redirect(`http://localhost:5713/admin?token=${accessToken}`);
    })(req, res, next);
};

