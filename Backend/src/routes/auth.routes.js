const express = require("express");
const router = express.Router();
const { login, refreshToken, logout, googleAuth, googleCallback } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

module.exports = router;
