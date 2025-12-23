const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('./models/station.model');
const MetroLine = require('./models/line.model');
const Train = require('./models/train.model');
const Schedule = require('./models/schedule.model');
const Ticket = require('./models/ticket.model');
const News = require('./models/new.model');
const Progress = require('./models/progress.model');

dotenv.config();

const fs = require('fs');
const logFile = 'seed_log.txt';
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const seedData = async () => {
    try {
        fs.writeFileSync(logFile, "Starting seed...\n");
        await mongoose.connect(process.env.MONGO_URI);
        log("✅ Connected to MongoDB");

        // CLEANUP
        log("Cleaning up old data...");
        await Promise.all([
            Station.deleteMany({}),
            MetroLine.deleteMany({}),
            Train.deleteMany({}),
            Schedule.deleteMany({}),
            Ticket.deleteMany({}),
            News.deleteMany({}),
            Progress.deleteMany({})
        ]);

        log("Creating new data...");

        // ==========================================
        // 1. DATA PREPARATION (Lines & Stations)
        // ==========================================

        // --- LINE 1: BEN THANH - SUOI TIEN (Operational/Testing) ---
        const stationsLine1 = [
            { name: "Ben Thanh", nameVi: "Bến Thành", address: "District 1", coordinates: [106.6983, 10.7721], isUnderground: true, isInterchange: true, status: 'operational' },
            { name: "Opera House", nameVi: "Nhà Hát Thành Phố", address: "District 1", coordinates: [106.7031, 10.7758], isUnderground: true, status: 'operational' },
            { name: "Ba Son", nameVi: "Ba Son", address: "District 1", coordinates: [106.7071, 10.7836], isUnderground: true, status: 'operational' },
            { name: "Van Thanh", nameVi: "Văn Thánh", address: "Binh Thanh", coordinates: [106.7163, 10.7944], isUnderground: false, status: 'operational' },
            { name: "Tan Cang", nameVi: "Tân Cảng", address: "Binh Thanh", coordinates: [106.7214, 10.7984], isUnderground: false, status: 'operational' },
            { name: "Thao Dien", nameVi: "Thảo Điền", address: "Thu Duc City", coordinates: [106.7328, 10.8033], isUnderground: false, status: 'operational' },
            { name: "An Phu", nameVi: "An Phú", address: "Thu Duc City", coordinates: [106.7423, 10.8028], isUnderground: false, status: 'operational' },
            { name: "Rach Chiec", nameVi: "Rạch Chiếc", address: "Thu Duc City", coordinates: [106.7561, 10.8122], isUnderground: false, status: 'operational' },
            { name: "Phuoc Long", nameVi: "Phước Long", address: "Thu Duc City", coordinates: [106.7634, 10.8229], isUnderground: false, status: 'operational' },
            { name: "Binh Thai", nameVi: "Bình Thái", address: "Thu Duc City", coordinates: [106.7695, 10.8315], isUnderground: false, status: 'operational' },
            { name: "Thu Duc", nameVi: "Thủ Đức", address: "Thu Duc City", coordinates: [106.7766, 10.8466], isUnderground: false, status: 'operational' },
            { name: "High Tech Park", nameVi: "Khu Công Nghệ Cao", address: "Thu Duc City", coordinates: [106.7951, 10.8643], isUnderground: false, status: 'operational' },
            { name: "Suoi Tien", nameVi: "Suối Tiên", address: "Thu Duc City", coordinates: [106.8024, 10.8732], isUnderground: false, status: 'operational' },
            { name: "Long Binh", nameVi: "Long Bình", address: "Thu Duc City", coordinates: [106.8173, 10.8878], isUnderground: false, isDepot: true, status: 'operational' }
        ];

        // --- LINE 2: BEN THANH - THAM LUONG (Construction) ---
        const stationsLine2 = [
            // Ben Thanh is shared, handled in creation logic
            { name: "Tao Dan", nameVi: "Tao Đàn", address: "District 1", coordinates: [106.6905, 10.7745], isUnderground: true, status: 'construction' },
            { name: "Dan Chu", nameVi: "Dân Chủ", address: "District 3", coordinates: [106.6832, 10.7788], isUnderground: true, status: 'construction' },
            { name: "Hoa Hung", nameVi: "Hòa Hưng", address: "District 10", coordinates: [106.6755, 10.7812], isUnderground: true, status: 'construction' },
            { name: "Le Thi Rieng", nameVi: "Lê Thị Riêng", address: "District 10", coordinates: [106.6668, 10.7853], isUnderground: true, status: 'construction' },
            { name: "Pham Van Hai", nameVi: "Phạm Văn Hai", address: "Tan Binh", coordinates: [106.6591, 10.7915], isUnderground: true, status: 'construction' },
            { name: "Bay Hien", nameVi: "Bảy Hiền", address: "Tan Binh", coordinates: [106.6515, 10.7952], isUnderground: true, isInterchange: true, status: 'construction' },
            { name: "Nguyen Hong Dao", nameVi: "Nguyễn Hồng Đào", address: "Tan Binh", coordinates: [106.6438, 10.8005], isUnderground: true, status: 'construction' },
            { name: "Ba Queo", nameVi: "Bà Quẹo", address: "Tan Binh", coordinates: [106.6355, 10.8055], isUnderground: true, isInterchange: true, status: 'construction' },
            { name: "Pham Van Bach", nameVi: "Phạm Văn Bạch", address: "Tan Binh", coordinates: [106.6288, 10.8122], isUnderground: true, status: 'construction' },
            { name: "Tham Luong", nameVi: "Tham Lương", address: "District 12", coordinates: [106.6195, 10.8195], isUnderground: true, isDepot: true, status: 'construction' }
        ];

        // --- LINE 3A: BEN THANH - TAN KIEN (Planned) ---
        const stationsLine3A = [
            // Ben Thanh shared
            { name: "Pham Ngu Lao", nameVi: "Phạm Ngũ Lão", address: "District 1", coordinates: [106.6932, 10.7688], isUnderground: true, status: 'planned' },
            { name: "Cong Hoa", nameVi: "Cộng Hòa", address: "District 3/5", coordinates: [106.6805, 10.7621], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Hung Vuong", nameVi: "Hùng Vương", address: "District 5", coordinates: [106.6701, 10.7588], isUnderground: true, status: 'planned' },
            { name: "Hong Bang", nameVi: "Hồng Bàng", address: "District 6", coordinates: [106.6555, 10.7544], isUnderground: true, status: 'planned' },
            { name: "Cay Go", nameVi: "Cây Gõ", address: "District 6", coordinates: [106.6455, 10.7522], isUnderground: true, status: 'planned' },
            { name: "Phu Lam", nameVi: "Phú Lâm", address: "District 6", coordinates: [106.6322, 10.7488], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Mien Tay", nameVi: "Bến xe Miền Tây", address: "Binh Tan", coordinates: [106.6155, 10.7422], isUnderground: false, status: 'planned' },
            { name: "Tan Kien", nameVi: "Tân Kiên", address: "Binh Chanh", coordinates: [106.5855, 10.7222], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        // --- LINE 4: THANH XUAN - HIEP PHUOC (Planned - Longest Line) ---
        const stationsLine4 = [
            { name: "Thanh Xuan", nameVi: "Thạnh Xuân", address: "District 12", coordinates: [106.6755, 10.8655], isUnderground: false, isDepot: true, status: 'planned' },
            { name: "Hanh Thong Tay", nameVi: "Hạnh Thông Tây", address: "Go Vap", coordinates: [106.6688, 10.8355], isUnderground: true, status: 'planned' },
            { name: "Go Vap Park", nameVi: "Công viên Gia Định", address: "Phu Nhuan", coordinates: [106.6755, 10.8055], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Phu Nhuan", nameVi: "Phú Nhuận", address: "Phu Nhuan", coordinates: [106.6812, 10.7955], isUnderground: true, status: 'planned' },
            { name: "Hai Ba Trung", nameVi: "Hai Bà Trưng", address: "District 1/3", coordinates: [106.6912, 10.7855], isUnderground: true, status: 'planned' },
            // Ben Thanh shared
            { name: "Hoang Dieu", nameVi: "Hoàng Diệu", address: "District 4", coordinates: [106.7012, 10.7622], isUnderground: true, status: 'planned' },
            { name: "Nguyen Van Linh", nameVi: "Nguyễn Văn Linh", address: "District 7", coordinates: [106.7155, 10.7455], isUnderground: false, status: 'planned' },
            { name: "Hiep Phuoc", nameVi: "Hiệp Phước", address: "Nha Be", coordinates: [106.7455, 10.6555], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        // --- LINE 5: SAIGON BRIDGE - CAN GIUOC (Planned - Ring Line) ---
        const stationsLine5 = [
            { name: "Saigon Bridge", nameVi: "Cầu Sài Gòn", address: "Binh Thanh", coordinates: [106.7255, 10.7999], isUnderground: true, isInterchange: true, status: 'planned' }, // Connects with Tan Cang
            { name: "Hang Xanh", nameVi: "Hàng Xanh", address: "Binh Thanh", coordinates: [106.7122, 10.8022], isUnderground: true, status: 'planned' },
            // Connects with Phu Nhuan (Line 4)
            // Connects with Bay Hien (Line 2)
            { name: "Dam Sen", nameVi: "Đầm Sen", address: "District 11", coordinates: [106.6455, 10.7688], isUnderground: true, status: 'planned' },
            { name: "Can Giuoc", nameVi: "Bến xe Cần Giuộc", address: "District 8", coordinates: [106.6255, 10.7255], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        // Insert Stations function
        const createdStations = {
            line1: [],
            line2: [],
            line3a: [],
            line4: [],
            line5: []
        };

        // Helper to create valid stations and return IDs
        async function createStationsForLine(stationList, key) {
            const savedStations = [];
            for (const s of stationList) {
                // Check if station exists (simple check by name to allow interchanges sharing)
                let station = await Station.findOne({ name: s.name });
                if (!station) {
                    station = await Station.create({ ...s, hasWifi: true });
                } else {
                    // Update interchange status if reused
                    if (!station.isInterchange) {
                        station.isInterchange = true;
                        await station.save();
                    }
                }
                savedStations.push(station);
            }
            createdStations[key] = savedStations;
            log(`Processed ${stationList.length} stations for ${key}`);
        }

        await createStationsForLine(stationsLine1, 'line1');
        await createStationsForLine(stationsLine2, 'line2');
        await createStationsForLine(stationsLine3A, 'line3a');
        await createStationsForLine(stationsLine4, 'line4');
        await createStationsForLine(stationsLine5, 'line5');


        // ==========================================
        // 2. METRO LINES
        // ==========================================

        const linesData = [
            {
                name: "Line 1: Ben Thanh - Suoi Tien",
                color: "#FF0000", // Red
                status: 'operational',
                openingDate: "2024-07-01",
                length: 19.7,
                stations: createdStations.line1.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "5 mins", offPeakHours: "10 mins" },
                operatingHours: { weekday: "05:00 - 23:00", weekend: "05:00 - 23:30" }
            },
            {
                name: "Line 2: Ben Thanh - Tham Luong",
                color: "#FFD700", // Gold/Yellow
                status: 'construction',
                openingDate: "2030-01-01",
                length: 11.0,
                stations: [createdStations.line1[0], ...createdStations.line2].map((s, i) => ({ station: s._id, order: i + 1 })), // Starts at Ben Thanh
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Line 3A: Ben Thanh - Tan Kien",
                color: "#0000FF", // Blue
                status: 'planned',
                openingDate: "TBD",
                length: 19.8,
                stations: [createdStations.line1[0], ...createdStations.line3a].map((s, i) => ({ station: s._id, order: i + 1 })), // Starts at Ben Thanh
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Line 4: Thanh Xuan - Hiep Phuoc",
                color: "#008000", // Green
                status: 'planned',
                openingDate: "TBD",
                length: 36.2,
                stations: createdStations.line4.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Line 5: Saigon Bridge - Can Giuoc",
                color: "#800080", // Purple
                status: 'planned',
                openingDate: "TBD",
                length: 23.4,
                stations: createdStations.line5.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            }
        ];

        const createdLines = await MetroLine.insertMany(linesData);
        log(`Created ${createdLines.length} Metro Lines.`);


        // ==========================================
        // 3. OTHER ENTITIES (News, Tickets, Progress)
        // ==========================================

        // Tickets (System-wide)
        const ticketsData = [
            { category: 'luot', sub_type: 'thuong', name: 'Vé Lượt (Tiêu chuẩn)', price: 12000, description: 'Vé một chiều.', status: 'active' },
            { category: 'ngay', sub_type: 'thuong', name: 'Vé 1 Ngày', price: 40000, description: 'Đi lại không giới hạn trong ngày.', status: 'active', trip_limit: 999 },
            { category: 'thang', sub_type: 'thuong', name: 'Vé Tháng (Tất cả các tuyến)', price: 260000, description: 'Đi lại thoải mái trong 30 ngày trên mọi tuyến vận hành.', status: 'active' },
            { category: 'nhom', sub_type: 'thuong', name: 'Vé Nhóm (3+ người)', price: 10000, description: 'Giá ưu đãi cho nhóm trên 3 người.', status: 'active' }
        ];
        await Ticket.insertMany(ticketsData);
        log("✅ Tickets created");

        // News
        const newsData = [
            {
                title: "Tuyến Metro số 1 chính thức vận hành thương mại",
                summary: "Sau nhiều năm chờ đợi, người dân TP.HCM đã có thể trải nghiệm tuyến metro đầu tiên.",
                content: "Sáng nay, chuyến tàu đầu tiên xuất phát từ ga Bến Thành...",
                author: "Ban Quản lý",
                category: "announcement",
                tags: ["line1", "hot"]
            },
            {
                title: "Khởi công giải phóng mặt bằng Tuyến số 2",
                summary: "Quận 3 và Tân Bình đẩy nhanh tiến độ bàn giao mặt bằng cho dự án Metro số 2.",
                content: "Dự kiến việc di dời hạ tầng kỹ thuật sẽ hoàn tất trong năm nay...",
                author: "Tin Tức Metro",
                category: "update",
                tags: ["line2", "construction"]
            },
            {
                title: "Quy hoạch tuyến Metro số 4 dọc trục Bắc Nam",
                summary: "Tuyến số 4 là tuyến dài nhất, đi qua các quận Gò Vấp, Phú Nhuận, Quận 1, Quận 4, Quận 7.",
                content: "UBND TP vừa phê duyệt điều chỉnh quy hoạch...",
                author: "Sở GTVT",
                category: "update",
                tags: ["line4", "planning"]
            }
        ];
        await News.insertMany(newsData);
        log("✅ News created");

        // Progress
        await Progress.create({
            title: "Hoàn thiện Line 1",
            description: "Các hạng mục cuối cùng của Line 1.",
            lineId: createdLines[0]._id, // Line 1
            startDate: new Date("2024-01-01"),
            estimatedCompletionDate: new Date("2024-07-01"),
            status: "completed",
            completionPercentage: 100,
            location: "Toàn tuyến",
            updates: [{ description: "Khai trương", percentageChange: 0, date: new Date() }]
        });

        await Progress.create({
            title: "Giải phóng mặt bằng Line 2",
            description: "Công tác đền bù và giải tỏa cho dự án Bến Thành - Tham Lương.",
            lineId: createdLines[1]._id, // Line 2
            startDate: new Date("2023-01-01"),
            estimatedCompletionDate: new Date("2025-12-31"),
            status: "in-progress",
            completionPercentage: 85,
            location: "Quận 3, Tân Bình",
            updates: [{ description: "Bàn giao mặt bằng CMT8", percentageChange: 5, date: new Date() }]
        });
        log("✅ Progress entries created");


        // ==========================================
        // 4. TRAINS & SCHEDULES (Active Lines Only)
        // ==========================================

        // Only generate trains for Line 1 as it's the only 'operational' or 'near operational' one in this context
        // for realistic simulation.
        const line1Obj = createdLines.find(l => l.name.includes("Line 1"));
        if (line1Obj) {
            const train1 = await Train.create({
                trainNumber: "TRAIN-L1-01",
                line: line1Obj._id,
                status: 'active',
                currentStation: createdStations.line1[0]._id,
                nextStation: createdStations.line1[1]._id
            });

            const train2 = await Train.create({
                trainNumber: "TRAIN-L1-02",
                line: line1Obj._id,
                status: 'active',
                currentStation: createdStations.line1[5]._id,
                nextStation: createdStations.line1[6]._id
            });

            log("Created Trains for Line 1.");

            // Create schedules relative to CURRENT time for simulation testing
            const baseTime = new Date();
            baseTime.setMinutes(baseTime.getMinutes() - 30); // Start schedules 30 mins ago

            const schedules = [];

            // Function to generate a full trip for a train
            const generateTrip = (trainId, startDelayMinutes) => {
                for (let i = 0; i < createdStations.line1.length; i++) {
                    const travelTime = i * 3; // 3 mins per station
                    const arr = new Date(baseTime.getTime() + (startDelayMinutes + travelTime) * 60000);
                    const dep = new Date(arr.getTime() + 1 * 60000); // 1 min stop

                    schedules.push({
                        line: line1Obj._id,
                        train: trainId,
                        station: createdStations.line1[i]._id,
                        order: i + 1,
                        arrivalTime: arr,
                        departureTime: dep,
                        status: 'scheduled'
                    });
                }
            };

            // Schedule for Train 1 (Just started)
            generateTrip(train1._id, 0);

            // Schedule for Train 2 (Starts 15 mins later)
            generateTrip(train2._id, 15);

            // Add a 3rd train for more activity
            const train3 = await Train.create({
                trainNumber: "TRAIN-L1-03",
                line: line1Obj._id,
                status: 'active',
                currentStation: createdStations.line1[0]._id, // will be autocalc
                nextStation: createdStations.line1[1]._id
            });
            generateTrip(train3._id, 30); // Starts 30 mins later (around "now")

            await Schedule.insertMany(schedules);
            log("Created Schedules for Line 1.");
        }

        log("🎉 FULL SEEDING COMPLETED!");
        process.exit(0);

    } catch (error) {
        log("❌ Seeding failed: " + error);
        process.exit(1);
    }
};

seedData();
