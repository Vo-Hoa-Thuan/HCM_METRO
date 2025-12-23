import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Clock, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Station, TrainStatus } from '@/types/schedule';
import { scheduleService } from '@/services/scheduleService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TrainSchedule = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [activeTrains, setActiveTrains] = useState<TrainStatus[]>([]);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Lấy danh sách trạm
                const stationsData = await scheduleService.fetchStations();
                setStations(stationsData);

                // Tạo lịch trình
                await scheduleService.generateDailySchedule();

                setLoading(false);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = format(now, 'HH:mm');
            setCurrentTime(timeString);
        };

        // Cập nhật thời gian mỗi giây
        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateTrainPositions = async () => {
            if (currentTime) {
                const trains = await scheduleService.getAllActiveTrains(currentTime);
                setActiveTrains(trains);
            }
        };

        // Cập nhật vị trí tàu mỗi 10 giây
        updateTrainPositions();
        const interval = setInterval(updateTrainPositions, 10000);

        return () => clearInterval(interval);
    }, [currentTime]);

    const getStationStatus = (stationId: string) => {
        const train = activeTrains.find(t =>
            t.currentStation === stationId || t.nextStation === stationId
        );

        if (!train) return 'inactive';
        if (train.currentStation === stationId && !train.isMoving) return 'active';
        if (train.nextStation === stationId && train.isMoving) return 'next';
        return 'inactive';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                Tra cứu lịch trình tàu Metro
                            </h1>
                            <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>
                                    {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
                                </span>
                                <span className="font-semibold text-blue-600">{currentTime}</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 py-8">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Hiển thị tàu đang hoạt động */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Tàu đang hoạt động</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeTrains.map((train) => (
                                            <motion.div
                                                key={train.trainId}
                                                className="bg-gray-50 rounded-lg p-4"
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                            >
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Train className="w-5 h-5 text-blue-600" />
                                                    <span className="font-medium">{train.trainId}</span>
                                                    {train.direction === 'forward' ? (
                                                        <ArrowRight className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ArrowLeft className="w-4 h-4 text-orange-600" />
                                                    )}
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <span className="text-gray-500">Trạm hiện tại:</span>
                                                        <span className="font-medium ml-2">
                                                            {stations.find(s => s.id === train.currentStation)?.name}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Trạm tiếp theo:</span>
                                                        <span className="font-medium ml-2">
                                                            {stations.find(s => s.id === train.nextStation)?.name}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Đến lúc:</span>
                                                        <span className="font-medium ml-2">{train.estimatedArrival}</span>
                                                    </p>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 transition-all duration-500"
                                                        style={{ width: `${train.progress}%` }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hiển thị tuyến tàu */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-6">Tuyến Metro Số 1</h2>
                                    <div className="relative">
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />
                                        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {stations.map((station, index) => {
                                                const status = getStationStatus(station.id);
                                                return (
                                                    <motion.div
                                                        key={station.id}
                                                        className="flex items-center space-x-3"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10
                                                                ${status === 'active' ? 'bg-green-600' :
                                                                    status === 'next' ? 'bg-yellow-500' :
                                                                        'bg-gray-400'}`}
                                                        >
                                                            <MapPin className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{station.name}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {station.timeFromPrevious > 0 &&
                                                                    `${station.timeFromPrevious} phút từ trạm trước`}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TrainSchedule; 