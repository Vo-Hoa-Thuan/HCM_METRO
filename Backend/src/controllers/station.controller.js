const Station = require('../models/station.model');

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
    await newStation.save();
    res.status(201).json(newStation);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo ga', error });
  }
};

// Cập nhật thông tin ga theo ID 
exports.updateStation = async (req, res) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id ,
      req.body,
      { new: true }
    );
    if (!updatedStation) return res.status(404).json({ error: "Ga không tồn tại" });
    res.status(200).json({ message: "Cap nhat thanh cong:", station: updatedStation});
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi cập nhật ga', details: error.message });
  }
};


// Xóa 1 ga theo ID 
exports.deleteStation = async (req, res) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) {
      return res.status(404).json({ message: 'Không tìm thấy ga để xóa' });
    }
    res.status(200).json({ message: 'Đã xóa ga', station: deletedStation });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa ga', error });
  }
};