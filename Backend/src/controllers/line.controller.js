const MetroLine = require('../models/line.model');
const Station = require('../models/station.model'); 
const mongoose = require('mongoose');
const { stationOrder, fareMatrix } = require('../utils/fare');

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
    console.error('Error fetching stations by line ID:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tìm tuyến đường giữa 2 ga
exports.searchRoutes = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Thiếu điểm xuất phát hoặc điểm đến' });
    }

    // Kiểm tra sự tồn tại của ga xuất phát và ga đến
    const originStation = await Station.findById(origin);
    const destinationStation = await Station.findById(destination);
    if (!originStation) {
      return res.status(404).json({ message: 'Ga xuất phát không tồn tại' });
    }

    if (originStation.status !== 'operational') {
      return res.status(404).json({ message: 'Ga xuất phát không hoạt động' });
    }

    if (!destinationStation) {
      return res.status(404).json({ message: 'Ga đến không tồn tại' });
    }

    if (destinationStation.status !== 'operational') {
      return res.status(404).json({ message: 'Ga đến không hoạt động' });
    }

    const lines = await MetroLine.find({ status: 'operational' }).populate('stations.station');

    // Xây dựng đồ thị các ga theo tuyến
    const graph = buildStationGraph(lines);

    // Kiểm tra xem ga xuất phát và ga đến có tồn tại trong đồ thị không
    if (!graph[origin]) {
      return res.status(404).json({ message: 'Ga xuất phát không có tuyến đường kết nối' });
    }

    if (!graph[destination]) {
      return res.status(404).json({ message: 'Ga đến không có tuyến đường kết nối' });
    }

    // Tìm đường đi từ ga xuất phát đến ga đến (dùng BFS)
    const path = await bfsFindRoute(origin, destination, graph);

    if (!path) {
      return res.status(404).json({ message: 'Không tìm thấy đường đi giữa hai ga' });
    }

    // Lấy thông tin các ga trong tuyến đường tìm được
    const stations = await Station.find({ _id: { $in: path } });

    // Tính toán giá vé
    const startName = originStation.nameVi;
    console.log('🚇 Ga xuất phát:', startName);
    const endName = destinationStation.nameVi;
    console.log('🚇 Ga đến:', endName);

    const startIndex = stationOrder.indexOf(startName);
    const endIndex = stationOrder.indexOf(endName);
    console.log('chỉ số ga xuất phát:', startIndex);
    console.log('chỉ số ga đến:', endIndex);

    if (startIndex === -1 || endIndex === -1) {
      return res.status(400).json({ message: 'Không thể tính giá vé vì ga không nằm trong bảng giá' });
    }
    
    const fare = fareMatrix[startIndex][endIndex] * 1000;

    res.status(200).json({
      message: 'Tìm thấy tuyến đường',
      path,
      stations,
      fare 
    });
  } catch (error) {
    console.error('Lỗi khi tìm tuyến đường:', error);
    res.status(500).json({ message: 'Lỗi server khi tìm tuyến đường', error });
  }
};

// Hàm xây dựng đồ thị các ga metro
const buildStationGraph = (lines) => {
  const graph = {};
  const stationIdToName = {}; 

  lines.forEach(line => {
    const stationList = line.stations; 

    for (let i = 0; i < stationList.length; i++) {
      const current = stationList[i];

      const currentStation = current.station;
      const currentId = currentStation._id.toString();
      const currentName = currentStation.name || `Station ${currentId}`;

      stationIdToName[currentId] = currentName;

      // Khởi tạo nếu chưa có
      if (!graph[currentId]) {
        graph[currentId] = new Set();
      }

      if (i > 0) {
        const prevStation = stationList[i - 1].station;
        const prevId = prevStation._id.toString();
        graph[currentId].add(prevId);

        if (!graph[prevId]) {
          graph[prevId] = new Set();
        }
        graph[prevId].add(currentId);
      }

    }
  });

  // In ra đồ thị với tên trạm
  const readableGraph = {};
  for (const id in graph) {
    const name = stationIdToName[id] || id;
    readableGraph[name] = Array.from(graph[id]).map(neighborId => stationIdToName[neighborId] || neighborId);
  }

  console.log('🚇 Đồ thị ga metro (dùng tên):');
  console.log(JSON.stringify(readableGraph, null, 2));

  return graph;
};

// Hàm tìm đường BFS
const bfsFindRoute = (origin, destination, graph) => {
  let queue = [origin];
  let visited = new Set();
  let parents = {};

  visited.add(origin);

  while (queue.length > 0) {
    let current = queue.shift();

    if (current === destination) {
      let path = [];
      let node = destination;
      while (node) {
        path.unshift(node);
        node = parents[node];
      }
      return path;
    }

    const neighbors = graph[current];
    if (!neighbors) continue;

    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parents[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  return null;
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


