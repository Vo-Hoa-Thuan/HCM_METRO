const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    category: { 
        type: String, 
        enum: ['luot', 'ngay', 'tuan', 'thang', 'khu hoi', 'nhom'], 
        required: true 
    },
    sub_type: { 
        type: String, 
        enum: ['thuong', 'sinhvien', 'nguoi_cao_tuoi'], 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, 
    description: { 
        type: String 
    }, 
    price: { 
        type: Number, 
        required: true 
    }, 
    trip_limit: { 
        type: Number, 
        default: null 
    },
    discount_percent: { 
        type: Number, 
        default: 0 
    },
    restrictions: { 
        type: String, 
        default: null 
    }, 
    availableFrom: { 
        type: Date, 
        default: null 
    }, 
    availableUntil: { 
        type: Date, 
        default: null 
    }, 
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'inactive' 
    }, 
});

module.exports = mongoose.model('Ticket', TicketSchema);