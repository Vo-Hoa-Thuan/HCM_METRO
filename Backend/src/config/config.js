const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    localhost: process.env.LOCALHOST || 'http://localhost:5173',
    frontendUrl: process.env.FRONTEND_URL || process.env.LOCALHOST || 'http://localhost:5173',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
    vnpay: {
        tmnCode: process.env.VNP_TMN_CODE || "EBUYIPAO",
        hashSecret: process.env.VNP_HASH_SECRET || "K94VH356YEWE8BPWSCR396E6W8P21QHH",
        url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        returnUrl: process.env.VNP_RETURN_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/vnpay/vnpay_return`
    }
};
