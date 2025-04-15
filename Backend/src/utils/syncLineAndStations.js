const Station = require('../models/station.model');
const MetroLine = require('../models/line.model');
const mongoose = require('mongoose');


// Thêm Station vào MetroLine
const addStationToLine = async (stationId, lineId) => {
  try {
    const metroLine = await MetroLine.findById(lineId);

    if (!metroLine) {
      throw new Error('MetroLine not found');
    }
    const newOrder = metroLine.stations.length + 1;
    metroLine.stations.push({ station: stationId, order: newOrder });
    const savedLine = await metroLine.save();

    console.log(`Trạm ${stationId} đã được thêm vào tuyến ${lineId}`);
    console.log('Cập nhật MetroLine:', savedLine);

    return savedLine;
  } catch (error) {
    console.error(`Lỗi khi thêm trạm vào tuyến: ${error.message}`);
    throw error;
  }
};


// Hàm xóa station khỏi các tuyến Metro
const removeStationFromLines = async (stationId) => {
  try {
    const metroLines = await MetroLine.find({ "stations.station": stationId });

    for (const line of metroLines) {
      line.stations = line.stations.filter(station => {
        return station.station && station.station.toString() !== stationId;
      });
      await line.save();
    }

    console.log(`Đã xóa station ${stationId} khỏi các tuyến Metro liên quan.`);
  } catch (error) {
    console.error(`Lỗi khi xóa station ${stationId} khỏi các tuyến Metro:`, error.message);
    throw error;
  }
};

// Đồng bộ hóa các tuyến Metro khi cập nhật Station
const syncStationLines = async (currentLines, newLines, stationId) => {
  console.log('Current Lines:', currentLines);
  console.log('New Lines:', newLines);
  console.log('Station ID:', stationId);

  try {
    // Chuyển đổi currentLines sang chuỗi để so sánh
    const currentLineIds = currentLines.map(lineId => lineId.toString());

    // Tìm các tuyến cần thêm và cần xóa
    const linesToAdd = newLines.filter(lineId => !currentLineIds.includes(lineId.toString()));
    const linesToRemove = currentLineIds.filter(lineId => !newLines.includes(lineId.toString()));

    console.log('Lines to Add:', linesToAdd);
    console.log('Lines to Remove:', linesToRemove);

    // Thêm ga vào các tuyến mới
    for (const lineId of linesToAdd) {
      console.log(`Đang thêm station ${stationId} vào tuyến ${lineId}`);
      const metroLine = await MetroLine.findById(lineId);

      if (!metroLine) {
        console.warn(`Không tìm thấy tuyến Metro với ID ${lineId}`);
        continue;
      }

      const newOrder = metroLine.stations.length + 1;
      metroLine.stations.push({ station: stationId, order: newOrder });

      await metroLine.save();
      console.log(`Đã thêm station ${stationId} vào tuyến ${lineId}`);
    }

    // Xóa ga khỏi các tuyến không còn liên quan
    for (const lineId of linesToRemove) {
      console.log(`Đang xóa station ${stationId} khỏi tuyến ${lineId}`);
      const metroLine = await MetroLine.findById(lineId);

      if (!metroLine) {
        console.warn(`Không tìm thấy tuyến Metro với ID ${lineId}`);
        continue;
      }

      metroLine.stations = metroLine.stations.filter(
        station => station.station.toString() !== stationId
      );

      await metroLine.save();
      console.log(`Đã xóa station ${stationId} khỏi tuyến ${lineId}`);
    }

    console.log(`Đồng bộ hóa thành công cho station ${stationId}`);
  } catch (error) {
    console.error(`Lỗi khi đồng bộ hóa các tuyến Metro: ${error.message}`);
    throw error;
  }
};


const updateStationLines = async (stations, lineId, action = 'add') => {
  try {
    if (stations && stations.length > 0) {
      for (const stationId of stations) {
        const station = await Station.findById(stationId);
        if (station) {
          station.lines = station.lines || [];

          if (action === 'add') {
            // Thêm lineId vào danh sách lines
            if (!station.lines.includes(lineId)) {
              station.lines.push(lineId);
            }
          } else if (action === 'remove') {
            // Xóa lineId khỏi danh sách lines
            station.lines = station.lines.filter(id => id.toString() !== lineId);
          }

          await station.save();
        }
      }
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách lines trong station:', error);
    throw error;
  }
};

/**
 * Cập nhật danh sách lines trong từng station
 * @param {Array} stations - Danh sách stationId
 * @param {String} lineId - ID của tuyến Metro
 */



module.exports = { addStationToLine, removeStationFromLines, syncStationLines };
module.exports = { updateStationLines };