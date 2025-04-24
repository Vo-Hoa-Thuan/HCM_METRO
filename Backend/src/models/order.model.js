const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    enum: ['luot', 'khu hoi', 'nhom', 'ngay', 'tuan', 'thang'],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['vnpay', 'card', 'qr', 'metro'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  routes: {
    type: Array, 
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Thêm theo loại vé
  expiryDate: {
    type: Date, // Nếu là vé không giới hạn lượt: vé ngày, tuần, tháng
  },
  usageCount: {
    type: Number, // Nếu là vé lượt, khứ hồi: số lượt
  },
  groupSize: {
    type: Number, // Nếu là vé nhóm: số người
  }, 
  qrCode: {
    type: String, 
  },
});

module.exports = mongoose.model('Order', OrderSchema);
