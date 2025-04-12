const MetroLine = require('../models/line.model');

exports.getAllMetroLines = async (req, res) => {
  try {
    const lines = await MetroLine.find();
    res.status(200).json(lines);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tuyến metro', error });
  }
};

// Lấy 1 tuyến theo ID
exports.getMetroLineById = async (req, res) => {
  try {
    const line = await MetroLine.findById(req.params.id);
    if (!line) return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });
    res.status(200).json(line);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy tuyến metro', error });
  }
};

// Tạo tuyến metro mới
exports.createMetroLine = async (req, res) => {
  try {
    const newLine = new MetroLine(req.body);
    const saved = await newLine.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
};

// Cập nhật tuyến metro
exports.updateMetroLine = async (req, res) => {
  try {
    const updated = await MetroLine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật tuyến metro', error });
  }
};

// Xóa tuyến metro
exports.deleteMetroLine = async (req, res) => {
  try {
    const deleted = await MetroLine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tuyến metro', error });
  }
};
