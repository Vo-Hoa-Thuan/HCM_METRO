const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');

require("dotenv").config();

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
            signupType: "phone",
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

exports.createUser = async (req, res) => {
    try {
        const { signupType, phoneNumber, name, password, role, email , address} = req.body;

        if (signupType === "phone") {
            if (!phoneNumber || !password || !name || !role) {
                return res.status(400).json({ error: "Thiếu thông tin đăng ký bằng SĐT" });
            }

            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                return res.status(400).json({ error: "Số điện thoại đã được sử dụng" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                phoneNumber,
                name,
                password: hashedPassword,   
                role,
                address,
                signupType
            });

            return res.status(201).json({ message: "Đăng ký bằng SĐT thành công", userId: newUser._id });

        } else if (signupType === "google") {
            if (!email || !name || !role) {
                return res.status(400).json({ error: "Thiếu thông tin đăng ký bằng Google" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email đã được sử dụng" });
            }

            const newUser = await User.create({
                email,
                name,
                role,
                address,
                signupType
            });

            return res.status(201).json({ message: "Đăng ký bằng Google thành công", userId: newUser._id });
        } else {
            return res.status(400).json({ error: "Hình thức đăng ký không hợp lệ" });
        }

    } catch (error) {
        console.error("Lỗi khi đăng ký user:", error);
        res.status(500).json({ error: "Lỗi khi đăng ký user" });
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


exports.updateUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, role, address, status } = req.body;
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) return res.status(404).json({ error: "User không tồn tại" });
        const updateData = {name, email, phoneNumber,address,status};

        if (role && req.user && req.user.role === "admin") {
            updateData.role = role; 
        }
      
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ); 
        res.status(200).json({
            message: "Cập nhật thành công",
            user: updatedUser,

        });
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
        res.status(500).json({ error: "Lỗi khi cập nhật user" });
    }
};


// 🔴 [DELETE] Xóa user
exports.deleteUser = async (req, res) => {
    console.log("User ID to delete:", req.params.id);
    try {
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) return res.status(404).json({ error: "User không tồn tại" });
  
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User đã bị xóa" });
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        res.status(500).json({ error: "Lỗi khi xóa user" });
    }
  };
  
  exports.getNewUsersByTime = async (req, res) => {
    try {
        const { range } = req.query;

        let startDate;
        console.log("Range nhận được:", range);

        switch (range) {
            case "day":
                startDate = moment().startOf("day");
                break;
            case "week":
                startDate = moment().startOf("week");
                break;
            case "month":
                startDate = moment().startOf("month");
                break;
            case "year":
            default:
                startDate = moment().startOf("year");
                break;
        }

        const newUsersCount = await User.countDocuments({
            createdAt: { $gte: startDate.toDate() }
        });

        res.json({
            timeRange: range,
            count: newUsersCount
        });
        console.log("Start date dùng để query:", startDate.toDate());


    } catch (error) {
        console.error("Lỗi khi thống kê người dùng:", error);
        res.status(500).json({ error: "Lỗi khi thống kê người dùng" });
    }
};