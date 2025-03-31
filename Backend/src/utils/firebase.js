// const admin = require("firebase-admin");
// const firebase = require("firebase/app");
// require("firebase/auth");

// const serviceAccount = require("../config/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// // Cấu hình Firebase Client SDK (cho frontend sử dụng)
// const firebaseConfig = {
//   apiKey: "AIzaSyApcP-U0NIeVch7ucgS-m6Y_rlh2owCsGE",
//   authDomain: "metro-hcm.firebaseapp.com",
//   projectId: "metro-hcm",
//   storageBucket: "metro-hcm.firebasestorage.app",
//   messagingSenderId: "845561410599",
//   appId: "1:845561410599:web:8905e0d5a6d5a66d234a02",
//   measurementId: "G-BVF6KNFSNH"
// };

// firebase.initializeApp(firebaseConfig);
const admin = require("firebase-admin");

// Khởi tạo Firebase Admin
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
