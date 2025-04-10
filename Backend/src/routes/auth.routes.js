const express = require("express");
const router = express.Router();
const { login, refreshToken, logout, googleAuth, googleCallback , getUserSessions } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/sessions", getUserSessions);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

module.exports = router;
