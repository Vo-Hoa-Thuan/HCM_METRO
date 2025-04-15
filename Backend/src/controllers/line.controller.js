const MetroLine = require('../models/line.model');
const mongoose = require('mongoose');


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

// Tạo mới tuyến metro
exports.createMetroLine = async (req, res) => {
  try {
    const { name, color, operatingHours, frequency, status, stations, openingDate, length, alerts } = req.body;

    // Kiểm tra nếu stations không hợp lệ
    if (!Array.isArray(stations) || stations.length === 0) {
      return res.status(400).json({ message: 'Danh sách stations không hợp lệ hoặc rỗng' });
    }

    // Tạo tuyến metro mới
    const newLine = await MetroLine.create({
      name,
      color,
      operatingHours,
      frequency,
      status,
      stations: stations.map((stationId, index) => ({
        station: stationId,
        order: index + 1
      })),
      openingDate,
      length,
      alerts
    });

    // Cập nhật danh sách lines trong các ga
    await mongoose.model('Station').updateMany(
      { _id: { $in: stations } },
      { $addToSet: { lines: newLine._id } }
    );

    res.status(201).json({ message: 'Tạo tuyến metro thành công', line: newLine });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo tuyến metro', error });
  }
};
  
// Cập nhật thông tin tuyến metro theo ID
exports.updateMetroLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, operatingHours, frequency, status, stations, openingDate, length, alerts } = req.body;

    // Kiểm tra nếu stations không hợp lệ
    if (stations && (!Array.isArray(stations) || stations.length === 0)) {
      return res.status(400).json({ message: 'Danh sách stations không hợp lệ hoặc rỗng' });
    }

    // Tìm tuyến metro cần cập nhật
    const line = await MetroLine.findById(id);
    if (!line) {
      return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });
    }

    // Cập nhật thông tin tuyến metro
    line.name = name || line.name;
    line.color = color || line.color;
    line.operatingHours = operatingHours || line.operatingHours;
    line.frequency = frequency || line.frequency;
    line.status = status || line.status;
    line.openingDate = openingDate || line.openingDate;
    line.length = length || line.length;
    line.alerts = alerts || line.alerts;

    // Nếu có cập nhật danh sách stations
    if (stations) {
      // Cập nhật danh sách stations
      line.stations = stations.map((stationId, index) => ({
        station: stationId,
        order: index + 1
      }));

      // Cập nhật danh sách lines trong các ga
      await mongoose.model('Station').updateMany(
        { lines: line._id },
        { $pull: { lines: line._id } } // Xóa tuyến metro khỏi các ga cũ
      );

      await mongoose.model('Station').updateMany(
        { _id: { $in: stations } },
        { $addToSet: { lines: line._id } } // Thêm tuyến metro vào các ga mới
      );
    }

    // Lưu thay đổi
    await line.save();

    res.status(200).json({ message: 'Cập nhật tuyến metro thành công', line });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật tuyến metro', error });
  }
};

// Xóa tuyến metro
exports.deleteMetroLine = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm tuyến metro cần xóa
    const line = await MetroLine.findById(id);
    if (!line) {
      return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });
    }

    // Xóa tuyến metro khỏi danh sách lines trong các ga liên quan
    const stationIds = line.stations.map(station => station.station);
    await mongoose.model('Station').updateMany(
      { _id: { $in: stationIds } },
      { $pull: { lines: line._id } } // Xóa tuyến metro khỏi danh sách lines
    );

    // Xóa tuyến metro
    await MetroLine.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa tuyến metro thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tuyến metro', error });
  }
};


// Lấy danh sách các ga theo ID tuyến metro
exports.getStationsByLineId = async (req, res) => {
  try {
    const line = await MetroLine.findById(req.params.id);

    if (!line) {
      return res.status(404).json({ message: 'Line not found' });
    }

    const stations = await Station.find({ name: { $in: line.stations } });

    res.json({
      lineName: line.name,
      stationCount: stations.length,
      stations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};