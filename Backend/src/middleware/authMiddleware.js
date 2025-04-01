const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Đảm bảo đường dẫn đúng

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

module.exports = authorizeAdmin;
