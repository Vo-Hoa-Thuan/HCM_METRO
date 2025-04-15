const MetroLine = require('../models/line.model');
const mongoose = require('mongoose');
const Station = require('../models/station.model');
const { updateStationLines } = require('../utils/syncLineAndStations');

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
    const { stations } = req.body;

    if (stations && stations.length > 0) {
      req.body.stations = stations.map((stationId, index) => {
        if (!mongoose.Types.ObjectId.isValid(stationId)) {
          throw new Error(`Station ID không hợp lệ: ${stationId}`);
        }
        return {
          station: new mongoose.Types.ObjectId(stationId), 
          order: index + 1 
        };
      });
    }

    const newLine = new MetroLine(req.body);
    const savedLine = await newLine.save();

    await updateStationLines(stations, savedLine._id);

    res.status(201).json(savedLine);
  } catch (error) {
    console.error('Lỗi khi tạo tuyến Metro:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
};

// Cập nhật tuyến metro
exports.updateMetroLine = async (req, res) => {
  try {
    const { stations } = req.body;

    const currentLine = await MetroLine.findById(req.params.id);
    if (!currentLine) return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });

    const currentStationIds = currentLine.stations.map(station => station.station.toString());
    const newStationIds = stations.map(stationId => {
      if (!mongoose.Types.ObjectId.isValid(stationId)) {
        throw new Error(`Station ID không hợp lệ: ${stationId}`);
      }
      return stationId;
    });

    const stationsToAdd = newStationIds.filter(id => !currentStationIds.includes(id));
    const stationsToRemove = currentStationIds.filter(id => !newStationIds.includes(id));

    req.body.stations = newStationIds.map((stationId, index) => ({
      station: new mongoose.Types.ObjectId(stationId),
      order: index + 1,
    }));

    const updatedLine = await MetroLine.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await updateStationLines(stationsToAdd, req.params.id, 'add'); 
    await updateStationLines(stationsToRemove, req.params.id, 'remove'); 

    res.status(200).json(updatedLine);
  } catch (error) {
    console.error('Lỗi khi cập nhật tuyến Metro:', error);
    res.status(400).json({ message: 'Lỗi khi cập nhật tuyến metro', error });
  }
};

// Xóa tuyến metro
exports.deleteMetroLine = async (req, res) => {
  try {

    const lineToDelete = await MetroLine.findById(req.params.id);
    if (!lineToDelete) return res.status(404).json({ message: 'Không tìm thấy tuyến metro' });

    const stationIds = lineToDelete.stations.map(station => station.station);

    const deleted = await MetroLine.findByIdAndDelete(req.params.id);

    await updateStationLines(stationIds, req.params.id, 'remove');

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa tuyến Metro:', error);
    res.status(500).json({ message: 'Lỗi khi xóa tuyến metro', error });
  }
};
