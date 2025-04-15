const Station = require('../models/station.model');
const { addStationToLine, removeStationFromLines, syncStationLines } = require('../utils/syncLineAndStations');

// Lấy danh sách tất cả các ga
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách ga', error });
  }
};

// Lấy thông tin 1 ga theo id
exports.getStationById = async (req, res) => {
  try {
    const station = await Station.findOne({ id: req.params.id });
    if (!station) return res.status(404).json({ message: 'Không tìm thấy ga' });
    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy ga', error });
  }
};

// Tạo mới 1 ga
exports.createStation = async (req, res) => {
  try {
    const newStation = new Station(req.body);

    const savedStation = await newStation.save();

    if (req.body.lines && req.body.lines.length > 0) {
      for (const lineId of req.body.lines) {
        await addStationToLine(savedStation._id, lineId);
      }
    }

    console.log("Station được lưu:", savedStation);

    res.status(201).json({ message: 'Station created successfully', station: savedStation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating station', error: error.message });
  }
};

// Cập nhật thông tin ga theo ID 
exports.updateStation = async (req, res) => {
  try {
    const stationId = req.params.id;

    // Lấy thông tin ga hiện tại
    const currentStation = await Station.findById(stationId);
    if (!currentStation) {
      return res.status(404).json({ error: "Ga không tồn tại" });
    }

    // Cập nhật thông tin ga
    const updatedStation = await Station.findByIdAndUpdate(
      stationId,
      req.body,
      { new: true }
    );

    // Đồng bộ hóa các tuyến Metro
    await syncStationLines(currentStation.lines, req.body.lines || [], stationId);

    res.status(200).json({ message: "Cập nhật thành công", station: updatedStation });
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi cập nhật ga', details: error.message });
  }
};


// Xóa 1 ga theo ID 
exports.deleteStation = async (req, res) => {
  try {
    const stationId = req.params.id;

    // Xóa Station khỏi các MetroLine liên quan
    await removeStationFromLines(stationId);

    // Xóa Station khỏi cơ sở dữ liệu
    const deletedStation = await Station.findByIdAndDelete(stationId);
    if (!deletedStation) {
      return res.status(404).json({ message: 'Không tìm thấy ga để xóa' });
    }

    res.status(200).json({ message: 'Đã xóa ga và cập nhật các tuyến Metro', station: deletedStation });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa ga', error: error.message });
  }
};