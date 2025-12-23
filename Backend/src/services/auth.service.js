const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const UserSession = require('../models/UserSession');
const AppError = require('../utils/appError');
const config = require('../config/config'); // We need to create this config file next
const parser = require('ua-parser-js');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' } // Refresh token usually lasts longer
    );

    return { accessToken, refreshToken };
};

exports.loginUser = async (phoneNumber, password, userAgentString, ip) => {
    if (!phoneNumber || !password) {
        throw new AppError('Vui lòng nhập số điện thoại và mật khẩu!', 400);
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new AppError('Số điện thoại chưa đăng ký!', 400);
    }

    if (!user.password) {
        throw new AppError('Mật khẩu không hợp lệ hoặc chưa được mã hóa!', 500);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Mật khẩu sai!', 400);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Update user refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Create session
    const ua = parser(userAgentString);
    await UserSession.create({
        userId: user._id,
        refreshToken,
        userAgent: userAgentString,
        ip,
        os: `${ua.os.name} ${ua.os.version}`,
        browser: `${ua.browser.name} ${ua.browser.version}`,
        device: ua.device.model || 'Unknown',
        lastActiveAt: new Date(),
    });

    return { user, accessToken, refreshToken };
};

exports.loginWithGoogle = async (user, userAgentString, ip) => {
    if (!user) throw new AppError('User not found via Google Auth', 400);

    const { accessToken, refreshToken } = generateTokens(user);

    // Update user refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Create session
    const ua = parser(userAgentString);
    await UserSession.create({
        userId: user._id,
        refreshToken,
        userAgent: userAgentString,
        ip,
        os: `${ua.os.name} ${ua.os.version}`,
        browser: `${ua.browser.name} ${ua.browser.version}`,
        device: ua.device.model || 'Unknown',
        lastActiveAt: new Date(),
    });

    return { user, accessToken, refreshToken };
};

exports.refreshAuthToken = async (oldRefreshToken) => {
    if (!oldRefreshToken) {
        throw new AppError('Không có Refresh Token!', 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
        throw new AppError('Refresh Token không hợp lệ!', 403);
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== oldRefreshToken) {
        throw new AppError('Refresh Token không hợp lệ!', 403);
    }

    const newAccessToken = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    return { newAccessToken, newRefreshToken };
};

exports.logoutUser = async (refreshToken) => {
    if (!refreshToken) throw new AppError('Không có Refresh Token!', 400);
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
}
