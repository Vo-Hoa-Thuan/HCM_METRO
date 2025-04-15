const Station = require('../models/station.model');
const MetroLine = require('../models/line.model');

/**
 * Thêm một ga vào danh sách stations trong các tuyến MetroLine
 * @param {String} stationId - ID của ga cần thêm
 * @param {Array} lineIds - Danh sách ID các tuyến MetroLine
 */
const addStationToLines = async (stationId, lineIds) => {
  await Promise.all(
    lineIds.map(async (lineId) => {
      const line = await MetroLine.findById(lineId);
      if (line) {
        const newOrder = line.stations.length + 1; // Tính thứ tự mới
        line.stations.push({ station: stationId, order: newOrder }); // Thêm ga vào danh sách
        await line.save(); // Lưu lại tuyến
      }
    })
  );
};

/**
 * Loại bỏ một ga khỏi danh sách stations trong các tuyến MetroLine
 * @param {String} stationId - ID của ga cần loại bỏ
 * @param {Array} lineIds - Danh sách ID các tuyến MetroLine
 */
const removeStationFromLines = async (stationId, lineIds) => {
  await MetroLine.updateMany(
    { _id: { $in: lineIds } },
    { $pull: { stations: { station: stationId } } } // Loại bỏ ga khỏi danh sách stations
  );
};

/**
 * Đồng bộ hóa danh sách stations trong các tuyến MetroLine
 * @param {String} stationId - ID của ga cần đồng bộ
 * @param {Array} oldLines - Danh sách ID các tuyến cũ
 * @param {Array} newLines - Danh sách ID các tuyến mới
 */
const syncStationLines = async (stationId, oldLines, newLines) => {
  // Loại bỏ ga khỏi các tuyến cũ
  await removeStationFromLines(stationId, oldLines);

  // Thêm ga vào các tuyến mới
  await addStationToLines(stationId, newLines);
};

module.exports = {
  addStationToLines,
  removeStationFromLines,
  syncStationLines,
};


