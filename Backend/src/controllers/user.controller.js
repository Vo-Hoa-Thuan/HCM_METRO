const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SECRET KEY dùng để ký JWT
const JWT_SECRET = process.env.JWT_SECRET;


exports.registerUser = async (req, res) => {
    try {
        const { phoneNumber, name, password } = req.body;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ error: "Số điện thoại đã được sử dụng" });
        }

        // Hash mật khẩu trước khi lưu vào database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            phoneNumber,
            name,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            role: "user", // Mặc định role là user
        });

        res.status(201).json({ message: "Đăng ký thành công", userId: newUser._id });
    } catch (error) {
        console.error("Lỗi khi đăng ký user:", error);
        res.status(500).json({ error: "Lỗi khi đăng ký user" });
    }
};


// 🔵 [GET] Lấy danh sách user
exports.getUsers = async (req, res) => {
    try {
        const roleFilter = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(roleFilter).select("-__v");
        res.json(users);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
    }
};

// 🟡 [GET] Lấy user theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-__v");
        if (!user) return res.status(404).json({ error: "User không tồn tại" });
        res.json(user);
    } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        res.status(500).json({ error: "Lỗi khi lấy user" });
    }
};

// 🟠 [PUT] Cập nhật user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        // Kiểm tra user tồn tại trước khi cập nhật
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) return res.status(404).json({ error: "User không tồn tại" });

        // Nếu không phải admin, không được thay đổi role
        const updateData = { name, email, phone };
        if (req.user?.role === 'admin') {
            updateData.role = role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
        res.status(500).json({ error: "Lỗi khi cập nhật user" });
    }
};

// 🔴 [DELETE] Xóa user
exports.deleteUser = async (req, res) => {
    try {
        // Chỉ admin mới được xóa user
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Bạn không có quyền xóa user" });
        }

        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) return res.status(404).json({ error: "User không tồn tại" });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User đã bị xóa" });
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        res.status(500).json({ error: "Lỗi khi xóa user" });
    }
};
