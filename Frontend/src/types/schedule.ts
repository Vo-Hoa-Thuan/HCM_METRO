export interface Station {
    id: string;
    name: string;
    timeFromPrevious: number; // Thời gian di chuyển từ trạm trước (phút)
}

export interface Schedule {
    trainId: string;
    departureTime: string; // Format: "HH:mm"
    direction: 'forward' | 'backward'; // Chiều đi hoặc về
    currentStation: string;
    isActive: boolean; // Đang chạy hay không
}

export interface TrainStatus {
    trainId: string;
    currentStation: string;
    nextStation: string;
    estimatedArrival: string;
    direction: 'forward' | 'backward';
    isMoving: boolean;
    progress: number; // Phần trăm hoàn thành quãng đường giữa 2 trạm (0-100)
}

export const OPERATION_HOURS = {
    start: "05:00",
    end: "23:30"
};

// Thời gian dừng ở mỗi trạm (1 phút)
export const STATION_STOP_TIME = 1;

// Tổng thời gian di chuyển một chiều (30 phút)
export const TOTAL_TRIP_TIME = 30;

// Danh sách các trạm Metro số 1
export const METRO_LINE_1_STATIONS: Station[] = [
    { id: "BX", name: "Bến Thành", timeFromPrevious: 0 },
    { id: "OC", name: "Nhà hát thành phố", timeFromPrevious: 3 },
    { id: "BA", name: "Ba Son", timeFromPrevious: 3 },
    { id: "VN", name: "Văn Thánh", timeFromPrevious: 4 },
    { id: "TN", name: "Tân Cảng", timeFromPrevious: 3 },
    { id: "TH", name: "Thảo Điền", timeFromPrevious: 3 },
    { id: "AN", name: "An Phú", timeFromPrevious: 3 },
    { id: "RG", name: "Rạch Chiếc", timeFromPrevious: 3 },
    { id: "PL", name: "Phước Long", timeFromPrevious: 3 },
    { id: "BT", name: "Bình Thái", timeFromPrevious: 2 },
    { id: "TL", name: "Thủ Đức", timeFromPrevious: 2 },
    { id: "HB", name: "High Tech Park", timeFromPrevious: 2 },
    { id: "SH", name: "Suối Tiên", timeFromPrevious: 2 },
    { id: "BXMT", name: "Bến xe Suối Tiên", timeFromPrevious: 2 }
]; 