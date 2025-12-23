const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const moment = require('moment');
const AppError = require('../utils/appError');

exports.registerUser = async (req, res, next) => {
    console.log("👉 registerUser called with:", req.body);
    try {
        const { phoneNumber, name, password } = req.body;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            throw new AppError("Số điện thoại đã được sử dụng", 400);
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

        res.status(201).json({ status: 'success', message: "Đăng ký thành công", userId: newUser._id });
    } catch (error) {
        next(error);
    }
};

// 🔵 [GET] Lấy danh sách user
exports.getUsers = async (req, res, next) => {
    try {
        const roleFilter = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(roleFilter).select("-__v");
        res.json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { signupType, phoneNumber, name, password, role, email, address } = req.body;

        if (signupType === "phone") {
            if (!phoneNumber || !password || !name || !role) {
                throw new AppError("Thiếu thông tin đăng ký bằng SĐT", 400);
            }

            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                throw new AppError("Số điện thoại đã được sử dụng", 400);
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

            return res.status(201).json({ status: 'success', message: "Đăng ký bằng SĐT thành công", userId: newUser._id });

        } else if (signupType === "google") {
            if (!email || !name || !role) {
                throw new AppError("Thiếu thông tin đăng ký bằng Google", 400);
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new AppError("Email đã được sử dụng", 400);
            }

            const newUser = await User.create({
                email,
                name,
                role,
                address,
                signupType
            });

            return res.status(201).json({ status: 'success', message: "Đăng ký bằng Google thành công", userId: newUser._id });
        } else {
            throw new AppError("Hình thức đăng ký không hợp lệ", 400);
        }

    } catch (error) {
        next(error);
    }
};


// 🟡 [GET] Lấy user theo ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-__v");
        if (!user) throw new AppError("User không tồn tại", 404);
        res.json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, role, address, status } = req.body;
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) throw new AppError("User không tồn tại", 404);
        const updateData = { name, email, phoneNumber, address, status };

        if (role && req.user && req.user.role === "admin") {
            updateData.role = role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            status: 'success',
            message: "Cập nhật thành công",
            user: updatedUser, // Keeping 'user' key for potential compatibility, but standard is data
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};


// 🔴 [DELETE] Xóa user
exports.deleteUser = async (req, res, next) => {
    try {
        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) throw new AppError("User không tồn tại", 404);

        await User.findByIdAndDelete(req.params.id);
        res.json({ status: 'success', message: "User đã bị xóa" });
    } catch (error) {
        next(error);
    }
};

exports.getNewUsersByTime = async (req, res, next) => {
    try {
        const { range } = req.query;

        let startDate;

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
            status: 'success',
            data: {
                timeRange: range,
                count: newUsersCount
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError("User không tồn tại", 404);
        }

        // Kiểm tra mật khẩu cũ có đúng không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new AppError("Mật khẩu cũ không đúng", 400);
        }

        // Hash mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ status: 'success', message: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};
