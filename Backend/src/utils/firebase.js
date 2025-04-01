
const admin = require("firebase-admin");

// Khởi tạo Firebase Admin
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
