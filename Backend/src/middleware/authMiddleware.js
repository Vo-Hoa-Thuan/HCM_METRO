const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      phoneNumber: decoded.phoneNumber,
      email: decoded.email,
      role: decoded.role,
    };
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Lấy token từ header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Vui lòng đăng nhập để truy cập', 401));
  }

  try {
    // 2) Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Kiểm tra nếu user vẫn tồn tại
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('Token không hợp lệ. Vui lòng đăng nhập lại', 401));
    }

    // 4) Lưu thông tin user vào request
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn', 401));
  }
});

module.exports = { authenticateToken, authorizeRoles };
