const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    localhost: process.env.LOCALHOST || 'https://hcm-metro.vercel.app'
};
