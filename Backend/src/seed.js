const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('./models/station.model');
const MetroLine = require('./models/line.model');
const Train = require('./models/train.model');
const Schedule = require('./models/schedule.model');
const Ticket = require('./models/ticket.model');
const News = require('./models/new.model');
const Progress = require('./models/progress.model');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
            { name: "Ben Thanh", nameVi: "Bến Thành", address: "District 1", coordinates: [106.698471, 10.773237], isUnderground: true, isInterchange: true, status: 'operational' },
            { name: "Opera House", nameVi: "Nhà Hát Thành Phố", address: "District 1", coordinates: [106.701685, 10.776830], isUnderground: true, status: 'operational' },
            { name: "Ba Son", nameVi: "Ba Son", address: "District 1", coordinates: [106.705928, 10.786654], isUnderground: true, status: 'operational' },
            { name: "Van Thanh", nameVi: "Văn Thánh", address: "Binh Thanh", coordinates: [106.714511, 10.801131], isUnderground: false, status: 'operational' },
            { name: "Tan Cang", nameVi: "Tân Cảng", address: "Binh Thanh", coordinates: [106.719940, 10.803595], isUnderground: false, status: 'operational' },
            { name: "Thao Dien", nameVi: "Thảo Điền", address: "Thu Duc City", coordinates: [106.730584, 10.803864], isUnderground: false, status: 'operational' },
            { name: "An Phu", nameVi: "An Phú", address: "Thu Duc City", coordinates: [106.747449, 10.803864], isUnderground: false, status: 'operational' },
            { name: "Rach Chiec", nameVi: "Rạch Chiếc", address: "Thu Duc City", coordinates: [106.766760, 10.803864], isUnderground: false, status: 'operational' },
            { name: "Phuoc Long", nameVi: "Phước Long", address: "Thu Duc City", coordinates: [106.770554, 10.814576], isUnderground: false, status: 'operational' },
            { name: "Binh Thai", nameVi: "Bình Thái", address: "Thu Duc City", coordinates: [106.776647, 10.824858], isUnderground: false, status: 'operational' },
            { name: "Thu Duc", nameVi: "Thủ Đức", address: "Thu Duc City", coordinates: [106.781368, 10.832131], isUnderground: false, status: 'operational' },
            { name: "High Tech Park", nameVi: "Khu Công Nghệ Cao", address: "Thu Duc City", coordinates: [106.789179, 10.840453], isUnderground: false, status: 'operational' },
            { name: "Suoi Tien", nameVi: "Suối Tiên", address: "Thu Duc City", coordinates: [106.796388, 10.847725], isUnderground: false, status: 'operational' },
            { name: "Long Binh", nameVi: "Long Bình", address: "Thu Duc City", coordinates: [106.802868, 10.853440], isUnderground: false, isDepot: true, status: 'operational' }
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
                name: "Tuyến số 1: Bến Thành - Suối Tiên",
                color: "#ff3b30", // Red
                status: 'operational',
                openingDate: "2024-07-01",
                length: 19.7,
                stations: createdStations.line1.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "5 phút", offPeakHours: "10 phút" },
                operatingHours: { weekday: "05:00 - 22:00", weekend: "05:00 - 23:00" }
            },
            {
                name: "Tuyến số 2: Bến Thành - Tham Lương",
                color: "#ffcc00", // Gold/Yellow
                status: 'construction',
                openingDate: "2030-01-01",
                length: 11.0,
                stations: [createdStations.line1[0], ...createdStations.line2].map((s, i) => ({ station: s._id, order: i + 1 })), // Starts at Ben Thanh
                frequency: { peakHours: "Chưa xác định", offPeakHours: "Chưa xác định" }
            },
            {
                name: "Tuyến số 3A: Bến Thành - Tân Kiên",
                color: "#007aff", // Blue
                status: 'planned',
                openingDate: "TBD",
                length: 19.8,
                stations: [createdStations.line1[0], ...createdStations.line3a].map((s, i) => ({ station: s._id, order: i + 1 })), // Starts at Ben Thanh
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Tuyến số 4: Thạnh Xuân - Hiệp Phước",
                color: "#34c759", // Green
                status: 'planned',
                openingDate: "TBD",
                length: 36.2,
                stations: createdStations.line4.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Tuyến số 5: Cầu Sài Gòn - Cần Giuộc",
                color: "#af52de", // Purple
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
            { category: 'luot', sub_type: 'thuong', name: 'Vé Lượt (Tiêu chuẩn)', price: 12000, description: 'Vé một chiều, có giá trị trong ngày.', status: 'active' },
            { category: 'ngay', sub_type: 'thuong', name: 'Vé 1 Ngày', price: 40000, description: 'Đi lại không giới hạn trong ngày đăng ký.', status: 'active', trip_limit: 999 },
            { category: 'thang', sub_type: 'thuong', name: 'Vé Tháng', price: 260000, description: 'Đi lại thoải mái trong 30 ngày.', status: 'active' },
            { category: 'nhom', sub_type: 'thuong', name: 'Vé Nhóm (3+ người)', price: 10000, description: 'Giá vé ưu đãi cho nhóm đông người.', status: 'active' }
        ];
        await Ticket.insertMany(ticketsData);
        log("✅ Tickets created");

        // News
        const newsData = [
            {
                title: "Vận hành thử nghiệm toàn tuyến Metro số 1",
                summary: "MAUR tổ chức chạy thử nghiệm tàu trên toàn tuyến Bến Thành - Suối Tiên với 100% công suất thiết kế.",
                content: "Sáng nay, Ban Quản lý Đường sắt đô thị (MAUR) đã tổ chức buổi chạy thử nghiệm... Việc thử nghiệm nhằm đánh giá kỹ thuật, độ an toàn và khả năng tích hợp của hệ thống...",
                author: "Ban Quản lý",
                category: "announcement",
                tags: ["line1", "testing", "hot"],
                image: "https://khpt.1cdn.vn/2025/03/09/metro1.jpeg"
            },
            {
                title: "Cập nhật tiến độ giải phóng mặt bằng Tuyến số 2",
                summary: "Quận 3 cam kết bàn giao 100% mặt bằng sạch trong quý 3 năm nay.",
                content: "Công tác giải phóng mặt bằng cho dự án Metro số 2 (Bến Thành - Tham Lương) đang được đẩy nhanh...",
                author: "Tin Tức Metro",
                category: "update",
                tags: ["line2", "construction"],
                image: "https://khpt.1cdn.vn/thumbs/900x600/2025/10/07/screen-shot-2025-10-07-at-10.35.19-am.png"
            },
            {
                title: "Đề xuất giá vé metro chính thức",
                summary: "Sở GTVT trình UBND TP.HCM phương án giá vé mới, ưu đãi cho học sinh, sinh viên.",
                content: "Theo đề xuất, giá vé lượt thấp nhất là 6.000 đồng, cao nhất là 20.000 đồng tùy cự ly...",
                author: "Sở GTVT",
                category: "update",
                tags: ["ticket", "policy"],
                image: "https://photo.znews.vn/w660/Uploaded/zdhwqmjwq/2024_12_18/thumb_znews.jpg"
            },
            {
                title: "Hệ thống bán vé tự động được lắp đặt tại các nhà ga",
                summary: "Hơn 100 máy bán vé tự động hiện đại đã được lắp đặt tại 14 nhà ga của Tuyến số 1.",
                content: "Hành khách có thể mua vé bằng tiền mặt, thẻ ngân hàng hoặc ví điện tử...",
                author: "Ban Quản lý",
                category: "promotion",
                tags: ["service", "tech"],
                image: "https://maisonoffice.vn/wp-content/uploads/2025/01/2-cac-tuyen-metro-tphcm-van-hanh-ca-duoi-long-dat-va-tren-cao.jpg"
            }
        ];
        await News.insertMany(newsData);
        log("✅ News created");

        // Progress
        await Progress.create({
            title: "Hoàn thiện kiến trúc nhà ga",
            description: "Hoàn thiện trang trí nội thất, lắp đặt thiết bị tại các nhà ga trên cao và ngầm.",
            lineId: createdLines[0]._id, // Line 1
            startDate: new Date("2023-01-01"),
            estimatedCompletionDate: new Date("2024-06-30"),
            status: "completed",
            completionPercentage: 100,
            location: "Toàn tuyến",
            updates: [{ description: "Hoàn tất lắp đặt mái che ga Tân Cảng", percentageChange: 0, date: new Date() }]
        });

        await Progress.create({
            title: "Đánh giá an toàn hệ thống (Safety Audit)",
            description: "Tư vấn độc lập đánh giá an toàn hệ thống trước khi vận hành thương mại.",
            lineId: createdLines[0]._id,
            startDate: new Date("2024-04-01"),
            estimatedCompletionDate: new Date("2024-07-01"),
            status: "in-progress",
            completionPercentage: 80,
            location: "Depot Long Bình",
            updates: [{ description: "Hoàn thành thử nghiệm động", percentageChange: 10, date: new Date() }]
        });

        await Progress.create({
            title: "Di dời hạ tầng kỹ thuật Line 2",
            description: "Di dời hệ thống điện, nước, viễn thông để chuẩn bị khởi công.",
            lineId: createdLines[1]._id, // Line 2
            startDate: new Date("2023-06-01"),
            estimatedCompletionDate: new Date("2025-06-01"),
            status: "in-progress",
            completionPercentage: 45,
            location: "Dọc trục đường Cách Mạng Tháng 8",
            updates: [{ description: "Bắt đầu di dời cáp ngầm tại ngã tư Bảy Hiền", percentageChange: 5, date: new Date() }]
        });
        log("✅ Progress entries created");


        // ==========================================
        // 4. TRAINS & SCHEDULES (2 Trains Only)
        // ==========================================

        const line1Obj = createdLines.find(l => l.name.includes("Tuyến số 1"));
        if (line1Obj) {
            // Create exactly 2 trains
            const train1 = await Train.create({
                trainNumber: "TRAIN-01",
                line: line1Obj._id,
                status: 'active',
                currentStation: createdStations.line1[0]._id,
                nextStation: createdStations.line1[1]._id
            });

            const train2 = await Train.create({
                trainNumber: "TRAIN-02",
                line: line1Obj._id,
                status: 'active',
                currentStation: createdStations.line1[13]._id, // Start at end
                nextStation: createdStations.line1[12]._id
            });

            log("Created 2 Trains for Line 1.");

            const schedules = [];
            const today = new Date();
            // Start of operation today
            const startTime = new Date(today);
            startTime.setHours(0, 0, 0, 0); // 00:00 - Start of day

            // End of operation today
            const endTime = new Date(today);
            endTime.setHours(23, 59, 59, 999); // 23:59 - End of day

            // Helper to create a one-way trip schedule
            const createOneWayTrip = (trainId, startStationIndex, endStationIndex, departureTime) => {
                let currentTime = new Date(departureTime);
                const isForward = startStationIndex < endStationIndex;
                const stationCount = createdStations.line1.length;

                // Duration between stations (mins)
                const travelTimePerStation = 3;
                const stopTime = 1;

                const tripSchedules = [];

                let i = startStationIndex;
                while (isForward ? i <= endStationIndex : i >= endStationIndex) {
                    const station = createdStations.line1[i];

                    // Arrival time is currentTime
                    // Departure time is currentTime + stopTime
                    const arr = new Date(currentTime);
                    const dep = new Date(currentTime.getTime() + stopTime * 60000);

                    tripSchedules.push({
                        line: line1Obj._id,
                        train: trainId,
                        station: station._id,
                        order: i + 1,
                        arrivalTime: arr,
                        departureTime: dep,
                        status: 'scheduled'
                    });

                    // Advance time for next station
                    currentTime = new Date(dep.getTime() + travelTimePerStation * 60000);

                    if (isForward) i++; else i--;
                }
                return { schedules: tripSchedules, endTime: currentTime };
            };

            // Generate daily schedule for Train 1 (Starts at Ben Thanh -> Suoi Tien -> Ben Thanh ...)
            let t1Time = new Date(startTime);
            while (t1Time < endTime) {
                // Forward: 0 -> 13
                const trip1 = createOneWayTrip(train1._id, 0, 13, t1Time);
                schedules.push(...trip1.schedules);

                // Turnaround time at Suoi Tien
                t1Time = new Date(trip1.endTime.getTime() + 10 * 60000);

                if (t1Time >= endTime) break;

                // Backward: 13 -> 0
                const trip2 = createOneWayTrip(train1._id, 13, 0, t1Time);
                schedules.push(...trip2.schedules);

                // Turnaround time at Ben Thanh
                t1Time = new Date(trip2.endTime.getTime() + 10 * 60000);
            }

            // Generate daily schedule for Train 2 (Starts at Suoi Tien -> Ben Thanh -> Suoi Tien ...)
            // Offset start slightly or start from other end
            let t2Time = new Date(startTime);
            while (t2Time < endTime) {
                // Backward: 13 -> 0
                const trip1 = createOneWayTrip(train2._id, 13, 0, t2Time);
                schedules.push(...trip1.schedules);

                // Turnaround time at Ben Thanh
                t2Time = new Date(trip1.endTime.getTime() + 10 * 60000);

                if (t2Time >= endTime) break;

                // Forward: 0 -> 13
                const trip2 = createOneWayTrip(train2._id, 0, 13, t2Time);
                schedules.push(...trip2.schedules);

                // Turnaround time at Suoi Tien
                t2Time = new Date(trip2.endTime.getTime() + 10 * 60000);
            }

            await Schedule.insertMany(schedules);
            log(`Created ${schedules.length} schedule entries.`);
        }

        log("🎉 FULL SEEDING COMPLETED!");
        process.exit(0);

    } catch (error) {
        log("❌ Seeding failed: " + error);
        process.exit(1);
    }
};

seedData();
