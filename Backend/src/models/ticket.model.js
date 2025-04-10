const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    category: { 
        type: String, 
        enum: ['luot', 'ngay', 'thang'], // Loại chính: lượt, ngày, tháng
        required: true 
    },
    sub_type: { 
        type: String, 
        enum: ['thuong', 'vip', 'sinhvien', 'nguoi_cao_tuoi'], // Kiểu vé phụ
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // Tên vé hiển thị (VD: "Vé tháng VIP sinh viên")
    description: { 
        type: String 
    }, // Mô tả vé cụ thể
    price: { 
        type: Number, 
        required: true 
    }, // Giá vé
    trip_limit: { 
        type: Number, 
        default: null 
    }, // Số lượt được đi (chỉ cho vé lượt)
    discount_percent: { 
        type: Number, 
        default: 0 
    }, // Tỷ lệ giảm giá (VD: 10 cho 10%)
    restrictions: { 
        type: String, 
        default: null 
    }, // Các hạn chế hoặc điều kiện áp dụng
    availableFrom: { 
        type: Date, 
        default: null 
    }, // Ngày bắt đầu vé có hiệu lực
    availableUntil: { 
        type: Date, 
        default: null 
    }, // Ngày kết thúc vé có hiệu lực
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'inactive' 
    }, // Trạng thái vé
});

module.exports = mongoose.model('Ticket', TicketSchema);