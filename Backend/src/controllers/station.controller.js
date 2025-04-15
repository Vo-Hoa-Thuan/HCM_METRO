const Station = require('../models/station.model');
const MetroLine = require('../models/line.model');
const { addStationToLines,syncStationLines,removeStationFromLines } = require('../utils/syncLineAndStations');
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
    // Lấy dữ liệu từ request body
    const stationData = req.body;

    // Tạo mới ga và lưu vào cơ sở dữ liệu
    const newStation = await Station.create(stationData);

    // Nếu có chọn lines, cập nhật danh sách stations trong các lines đó
    if (stationData.lines && stationData.lines.length > 0) {
      await addStationToLines(newStation._id, stationData.lines);
    }

    res.status(201).json({ message: 'Tạo mới ga thành công', station: newStation });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo mới ga', error: error.message });
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

    // Đồng bộ hóa các tuyến Metro nếu danh sách lines thay đổi
    if (req.body.lines) {
      const oldLines = currentStation.lines || [];
      const newLines = req.body.lines;

      await syncStationLines(stationId, oldLines, newLines);
    }

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
    const lines = await MetroLine.find({ "stations.station": stationId });
    const lineIds = lines.map(line => line._id);
    await removeStationFromLines(stationId, lineIds);

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
