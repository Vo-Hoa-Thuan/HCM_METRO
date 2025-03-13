const User = require('../models/user.model');

// 🟢 [POST] Tạo user mới
exports.createUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newUser = await User.create({ name, email, phone });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Lỗi khi tạo user" });
    }
};

// 🔵 [GET] Lấy danh sách user
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
    }
};

// 🟡 [GET] Lấy user theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User không tồn tại" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy user" });
    }
};

// 🟠 [PUT] Cập nhật user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, { name, email, phone }, { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User không tồn tại" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật user" });
    }
};

// 🔴 [DELETE] Xóa user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User không tồn tại" });
        res.json({ message: "User đã bị xóa" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa user" });
    }
};
