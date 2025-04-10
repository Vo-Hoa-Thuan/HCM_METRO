const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

// Lấy danh sách tất cả vé
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách vé" });
    }
};

// Lấy vé theo ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy thông tin vé" });
    }
};

// Lấy vé theo loại (Category)
exports.getTicketByType = async (req, res) => {
    try {
        const { type } = req.params;
        const tickets = await Ticket.find({ category: type });
        if (!tickets.length) return res.status(404).json({ error: "Không có vé nào" });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách vé theo loại" });
    }
};

// Lấy danh sách các loại vé (Category)
exports.getTicketTypes = async (req, res) => {
    try {
        const types = await Ticket.distinct('category'); 
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách loại vé" });
    }
};

// Tạo vé mới
exports.createTicket = async (req, res) => {
    try {
        const {
            category,
            sub_type,
            name,
            description,
            price,
            trip_limit,
            discount_percent,
            restrictions,
            availableFrom,
            availableUntil,
            status,
        } = req.body;

        const newTicket = new Ticket({
            category,
            sub_type,
            name,
            description,
            price,
            trip_limit,
            discount_percent,
            restrictions,
            availableFrom,
            availableUntil,
            status,
        });

        await newTicket.save();
        res.status(201).json({ message: "Tạo vé thành công", ticket: newTicket });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo vé", details: error.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json({ message: "Cập nhật vé thành công", ticket: updatedTicket });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật vé", details: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) return res.status(404).json({ error: "Vé không tồn tại" });
        res.status(200).json({ message: "Vé đã bị xóa vĩnh viễn", ticket: deletedTicket });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa vé", details: error.message });
    }
};