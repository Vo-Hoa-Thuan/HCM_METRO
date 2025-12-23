const MetroLine = require('../models/line.model');
const Station = require('../models/station.model');
const mongoose = require('mongoose');
const { stationOrder, fareMatrix } = require('../utils/fare');
const Train = require('../models/train.model');
const Schedule = require('../models/schedule.model');

exports.getAllMetroLines = async (req, res) => {
  try {
    const lines = await MetroLine.find().populate('stations.station');
    res.status(200).json(lines);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tuyến metro', error });
  }
};

// Lấy 1 tuyến theo ID
exports.getMetroLineById = async (req, res) => {
  try {
    const line = await MetroLine.findById(req.params.id).populate('stations.station');
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
    const line = await MetroLine.findById(req.params.id).populate('stations.station');
    if (!line) {
      return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
    }
    res.json(line.stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tìm tuyến đường giữa 2 ga
exports.searchRoutes = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Vui lòng cung cấp điểm đi và điểm đến' });
    }

    // Kiểm tra sự tồn tại của ga xuất phát và ga đến
    const originStation = await Station.findById(origin);
    const destinationStation = await Station.findById(destination);

    if (!originStation || !destinationStation) {
      return res.status(404).json({ message: 'Ga không tồn tại' });
    }

    if (originStation.status !== 'operational' || destinationStation.status !== 'operational') {
      return res.status(400).json({ message: 'Một trong các ga đang không hoạt động' });
    }

    // Lấy tất cả các tuyến đang hoạt động
    const lines = await MetroLine.find({ status: { $in: ['operational', 'construction'] } }) // Allow construction for now if data isn't perfect, or stick to operational
      .populate('stations.station')
      .lean();

    // Loc cac tuyen thuc su operational neu muon
    const operationalLines = lines.filter(l => l.status === 'operational');

    // Build Graph
    const graph = buildStationGraph(operationalLines);

    // Find Path (BFS)
    const route = findRoute(origin, destination, graph);

    if (!route) {
      // Fallback: Try including construction lines if operational didn't work, or just return 404
      return res.status(404).json({ message: 'Không tìm thấy đường đi giữa hai ga' });
    }

    // Get real-time info for the path
    const realTimeInfo = await getRealTimeInfoForPath(route.path);

    // Stations details
    const stations = await Station.find({ _id: { $in: route.path } });
    // Sort stations according to path order
    const sortedStations = route.path.map(id => stations.find(s => s._id.toString() === id.toString())).filter(Boolean);


    // Calculate Fare (Simple logic or Matrix)
    const fare = calculateFareSimple(sortedStations);

    res.status(200).json({
      message: 'Tìm thấy tuyến đường',
      path: route.path,
      stations: sortedStations,
      fare,
      duration: route.duration, // Estimated
      realTimeInfo
    });

  } catch (error) {
    console.error('Lỗi khi tìm tuyến đường:', error);
    res.status(500).json({ message: 'Lỗi server khi tìm tuyến đường', error: error.message });
  }
};

const buildStationGraph = (lines) => {
  const graph = {};

  lines.forEach(line => {
    if (!line.stations) return;

    // Sort stations by order just in case
    const sortedStations = line.stations.sort((a, b) => a.order - b.order);

    sortedStations.forEach((item, index) => {
      if (!item.station) return;
      const stationId = item.station._id.toString();

      if (!graph[stationId]) {
        graph[stationId] = { neighbors: [] };
      }

      // Previous station
      if (index > 0 && sortedStations[index - 1].station) {
        const prevId = sortedStations[index - 1].station._id.toString();
        // Distance roughly 2 mins or calculated
        graph[stationId].neighbors.push({ id: prevId, time: 2, lineId: line._id });
      }

      // Next station
      if (index < sortedStations.length - 1 && sortedStations[index + 1].station) {
        const nextId = sortedStations[index + 1].station._id.toString();
        graph[stationId].neighbors.push({ id: nextId, time: 2, lineId: line._id });
      }
    });
  });
  return graph;
};

const findRoute = (startId, endId, graph) => {
  // BFS
  const queue = [{ id: startId, path: [startId], duration: 0 }];
  const visited = new Set();

  while (queue.length > 0) {
    const { id, path, duration } = queue.shift();

    if (id === endId) return { path, duration };

    if (visited.has(id)) continue;
    visited.add(id);

    const neighbors = graph[id]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.id)) {
        queue.push({
          id: neighbor.id,
          path: [...path, neighbor.id],
          duration: duration + neighbor.time
        });
      }
    }
  }
  return null;
};

const getRealTimeInfoForPath = async (pathIds) => {
  // Mock simple real-time info or query latest schedules
  // For now returning mock data to avoid complex Schedule querying if not strictly needed for basic route
  // Could enhance this to query Schedule model for next arrival at each station
  return pathIds.reduce((acc, id) => {
    acc[id] = {
      nextTrain: Math.floor(Math.random() * 15) + 1, // Random 1-15 mins
      crowd: 'low'
    };
    return acc;
  }, {});
};

const calculateFareSimple = (stations) => {
  // Base fare + distance based
  if (stations.length <= 1) return 0;
  const basePrice = 12000;
  const pricePerUr = 4000; // Roughly per station distance
  // Just a placeholder logic
  return basePrice + (stations.length - 1) * 2000;
};

// Removed old broken helper functions to avoid confusion
const calculateNextTrainTime = () => 0; // Placeholder

// Hàm tính mức độ đông đúc
const calculateCrowdLevel = (schedule, station) => {
  const occupancy = station.occupancy || 0;
  if (occupancy < 0.3) return 'low';
  if (occupancy < 0.7) return 'medium';
  return 'high';
};

// Hàm tính thời gian trễ
const calculateDelay = (schedule, station) => {
  return station.delay || 0;
};

const calculateFare = (stationNames, fareMatrix) => {
  if (!stationNames || stationNames.length < 2) return 0;

  const start = stationNames[0];
  const end = stationNames[stationNames.length - 1];

  if (fareMatrix[start] && fareMatrix[start][end]) {
    return fareMatrix[start][end] * 1000;
  }

  return null; // Không tìm thấy giá
};


