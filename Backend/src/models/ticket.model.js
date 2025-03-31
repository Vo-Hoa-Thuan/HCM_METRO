const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip_id: { type: String, required: true }, 
    qr_code: { type: String, unique: true, required: true },
    status: { type: String, enum: ['Active', 'Used', 'Expired'], default: 'Active' },
    purchased_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
