const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

// Lấy danh sách tất cả vé
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('user_id', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách vé" });
    }
};

// Lấy vé theo ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user_id', 'name email');
        if (!ticket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy thông tin vé" });
    }
};

// Tạo vé mới
exports.createTicket = async (req, res) => {
    try {
        const { user_id, trip_id, qr_code } = req.body;
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ error: "User không tồn tại" });

        const newTicket = await Ticket.create({ user_id, trip_id, qr_code });
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo vé" });
    }
};

// Cập nhật vé (VD: cập nhật trạng thái)
exports.updateTicket = async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật vé" });
    }
};

// Xóa vé
exports.deleteTicket = async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json({ message: "Vé đã bị xóa" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa vé" });
    }
};
