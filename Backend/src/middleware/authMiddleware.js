const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// const User = require('../models/UserSession');

const authorizeAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Lấy token từ cookie hoặc headers

  if (!token) {
    return res.status(403).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token
    const user = await User.findById(decoded.userId); // Lấy thông tin người dùng từ database

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Bạn không có quyền truy cập vào trang này" });
    }

    req.user = user; // Lưu thông tin người dùng vào req.user để sử dụng sau này
    next(); // Tiếp tục với các route tiếp theo nếu là admin
  } catch (error) {
    return res.status(403).json({ message: "Lỗi xác thực token" });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken; // hoặc từ header: req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // hoặc decoded._id tùy bạn ký token như nào

    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    req.user = user; // GÁN user vào request
    next();
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authorizeAdmin, authMiddleware;
