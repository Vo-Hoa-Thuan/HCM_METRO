const express = require("express");
const router = express.Router();
const { login, refreshToken, logout, googleAuth, googleCallback , getUserSessions, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware.authenticateToken, logout);
router.get("/sessions", authMiddleware.authenticateToken, getUserSessions);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/me", authMiddleware.authenticateToken, getMe);

module.exports = router;
