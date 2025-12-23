import { Station, Schedule, TrainStatus, OPERATION_HOURS, STATION_STOP_TIME } from '@/types/schedule';

// Mock data cho các trạm Metro Line 1
const MOCK_STATIONS: Station[] = [
    { id: 'st1', name: 'Bến Thành', timeFromPrevious: 0 },
    { id: 'st2', name: 'Nhà hát Thành phố', timeFromPrevious: 2 },
    { id: 'st3', name: 'Ba Son', timeFromPrevious: 2 },
    { id: 'st4', name: 'Văn Thánh', timeFromPrevious: 2 },
    { id: 'st5', name: 'Tân Cảng', timeFromPrevious: 2 },
    { id: 'st6', name: 'Thảo Điền', timeFromPrevious: 2 },
    { id: 'st7', name: 'An Phú', timeFromPrevious: 2 },
    { id: 'st8', name: 'Rạch Chiếc', timeFromPrevious: 2 },
    { id: 'st9', name: 'Phước Long', timeFromPrevious: 2 },
    { id: 'st10', name: 'Bình Thái', timeFromPrevious: 2 },
    { id: 'st11', name: 'Thủ Đức', timeFromPrevious: 2 },
    { id: 'st12', name: 'Khu Công nghệ cao', timeFromPrevious: 2 },
    { id: 'st13', name: 'Suối Tiên', timeFromPrevious: 2 },
    { id: 'st14', name: 'BXMT Suối Tiên', timeFromPrevious: 2 }
];

class ScheduleService {
    private stations: Station[] = MOCK_STATIONS;
    private currentSchedules: Schedule[] = [];

    // Lấy danh sách trạm (sử dụng mock data)
    async fetchStations(): Promise<Station[]> {
        // Trả về mock data thay vì gọi API
        return Promise.resolve(this.stations);
    }

    // Tính tổng thời gian di chuyển từ trạm đầu đến trạm cuối
    private calculateTotalTripTime(): number {
        return this.stations.reduce((total, station) => total + station.timeFromPrevious, 0) +
            (this.stations.length - 1) * STATION_STOP_TIME;
    }

    // Tính toán thời gian di chuyển giữa hai trạm
    private calculateTimeBetweenStations(fromStationId: string, toStationId: string): number {
        const fromIndex = this.stations.findIndex(s => s.id === fromStationId);
        const toIndex = this.stations.findIndex(s => s.id === toStationId);

        if (fromIndex === -1 || toIndex === -1) return 0;

        let totalTime = 0;
        const step = fromIndex < toIndex ? 1 : -1;

        for (let i = fromIndex; i !== toIndex; i += step) {
            totalTime += this.stations[i + step].timeFromPrevious;
        }

        return totalTime;
    }

    // Kiểm tra xem thời gian hiện tại có trong giờ hoạt động không
    private isOperatingHours(currentTime: string): boolean {
        const current = this.parseTime(currentTime);
        const start = this.parseTime(OPERATION_HOURS.start);
        const end = this.parseTime(OPERATION_HOURS.end);
        return current >= start && current <= end;
    }

    // Chuyển đổi thời gian từ string "HH:mm" sang số phút từ 00:00
    private parseTime(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Chuyển đổi số phút sang format "HH:mm"
    private formatTime(minutes: number): string {
        const totalMinutes = minutes % (24 * 60); // Đảm bảo không vượt quá 24h
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    // Tính toán thời gian đến trạm cụ thể
    calculateTimeToStation(fromStationId: string, toStationId: string, currentProgress: number): number {
        const fromIndex = this.stations.findIndex(s => s.id === fromStationId);
        const toIndex = this.stations.findIndex(s => s.id === toStationId);

        if (fromIndex === -1 || toIndex === -1) return 0;

        let totalTime = 0;
        const remainingProgress = 100 - currentProgress;

        // Nếu đang ở trạm hiện tại
        if (remainingProgress < 100) {
            totalTime += (remainingProgress / 100) * this.stations[fromIndex].timeFromPrevious;
        }

        // Tính thời gian di chuyển qua các trạm trung gian
        if (fromIndex < toIndex) {
            for (let i = fromIndex + 1; i < toIndex; i++) {
                totalTime += this.stations[i].timeFromPrevious + STATION_STOP_TIME;
            }
        } else {
            for (let i = fromIndex - 1; i > toIndex; i--) {
                totalTime += this.stations[i].timeFromPrevious + STATION_STOP_TIME;
            }
        }

        return Math.ceil(totalTime);
    }

    // Tạo lịch trình cho cả ngày
    async generateDailySchedule(): Promise<Schedule[]> {
        const schedules: Schedule[] = [];
        const startTime = this.parseTime(OPERATION_HOURS.start);
        const endTime = this.parseTime(OPERATION_HOURS.end);

        // Tạo lịch trình mỗi 15 phút
        const INTERVAL = 15;
        let trainId = 1;

        for (let time = startTime; time <= endTime; time += INTERVAL) {
            // Tàu đi từ Bến Thành
            schedules.push({
                trainId: `T${trainId}`,
                departureTime: this.formatTime(time),
                direction: 'forward',
                currentStation: this.stations[0].id,
                isActive: true
            });

            // Tàu đi từ Suối Tiên (7 phút sau)
            schedules.push({
                trainId: `T${trainId + 1}`,
                departureTime: this.formatTime(time + 7),
                direction: 'backward',
                currentStation: this.stations[this.stations.length - 1].id,
                isActive: true
            });

            trainId += 2;
        }

        this.currentSchedules = schedules;
        return schedules;
    }

    // Tính toán trạng thái hiện tại của tàu
    async calculateTrainStatus(trainId: string, currentTime: string): Promise<TrainStatus | null> {
        const schedule = this.currentSchedules.find(s => s.trainId === trainId);
        if (!schedule || !schedule.isActive) return null;

        const currentTimeMinutes = this.parseTime(currentTime);
        const departureTimeMinutes = this.parseTime(schedule.departureTime);
        const timeSinceDeparture = currentTimeMinutes - departureTimeMinutes;

        if (timeSinceDeparture < 0) return null; // Tàu chưa khởi hành

        const totalTripTime = this.calculateTotalTripTime();
        if (timeSinceDeparture > totalTripTime) return null; // Tàu đã hoàn thành hành trình

        let accumulatedTime = 0;
        let currentStation = this.stations[0].id;
        let nextStation = this.stations[1].id;
        let isMoving = true;
        let progress = 0;

        if (schedule.direction === 'backward') {
            currentStation = this.stations[this.stations.length - 1].id;
            nextStation = this.stations[this.stations.length - 2].id;
        }

        // Tính toán vị trí hiện tại của tàu
        const stationsToCheck = schedule.direction === 'forward'
            ? this.stations
            : [...this.stations].reverse();

        for (let i = 0; i < stationsToCheck.length - 1; i++) {
            const currentStationTime = accumulatedTime;
            const travelTime = stationsToCheck[i + 1].timeFromPrevious;
            const nextStationTime = currentStationTime + travelTime + STATION_STOP_TIME;

            if (timeSinceDeparture >= currentStationTime && timeSinceDeparture < nextStationTime) {
                currentStation = stationsToCheck[i].id;
                nextStation = stationsToCheck[i + 1].id;

                const timeInSegment = timeSinceDeparture - currentStationTime;
                if (timeInSegment < travelTime) {
                    // Đang di chuyển giữa các trạm
                    isMoving = true;
                    progress = (timeInSegment / travelTime) * 100;
                } else {
                    // Đang dừng tại trạm
                    isMoving = false;
                    progress = 100;
                }
                break;
            }

            accumulatedTime = nextStationTime;
        }

        const estimatedArrival = this.formatTime(
            currentTimeMinutes +
            (isMoving ? this.calculateTimeBetweenStations(currentStation, nextStation) : 0) +
            (isMoving ? 0 : STATION_STOP_TIME)
        );

        return {
            trainId,
            currentStation,
            nextStation,
            estimatedArrival,
            direction: schedule.direction,
            isMoving,
            progress
        };
    }

    // Lấy trạng thái của tất cả các tàu đang chạy
    async getAllActiveTrains(currentTime: string): Promise<TrainStatus[]> {
        if (!this.isOperatingHours(currentTime)) {
            return [];
        }

        const activeTrains: TrainStatus[] = [];

        for (const schedule of this.currentSchedules) {
            const status = await this.calculateTrainStatus(schedule.trainId, currentTime);
            if (status) {
                activeTrains.push(status);
            }
        }

        return activeTrains;
    }
}

export const scheduleService = new ScheduleService(); 