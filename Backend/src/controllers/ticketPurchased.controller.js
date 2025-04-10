const TicketPurchased = require('../models/ticketPurchased.model');

exports.getTicketsPurchased = async (req, res) => {
    try {
        const tickets = await TicketPurchased.find().populate({is_active: true});
        if (!tickets.length) return res.status(404).json({ error: "Không có vé nào" });
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách vé" });
    }
}; 
