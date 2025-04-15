const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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

module.exports = { authenticateToken, authorizeRoles };
