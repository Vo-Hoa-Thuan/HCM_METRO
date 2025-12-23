
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Search, Clock, Ticket, MapPin, Milestone, Train, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getAllStations } from '@/api/stationsApi';
import { searchRoutes, RouteResponse } from '@/api/lineApi';
import { useNavigate } from 'react-router-dom';
import MetroMap from '@/components/map/MetroMap';

interface StationOption {
    id: string; // The ID of the station (needed for API)
    _id: string;
    name: string; // The name for display
    nameVi: string;
}

const RouteExplorer: React.FC = () => {
    // Initialize state from sessionStorage if available
    const [stations, setStations] = useState<StationOption[]>([]);

    const [originId, setOriginId] = useState<string>(() => {
        return sessionStorage.getItem('route_originId') || '';
    });
    const [destinationId, setDestinationId] = useState<string>(() => {
        return sessionStorage.getItem('route_destinationId') || '';
    });
    const [routes, setRoutes] = useState<RouteResponse | null>(() => {
        const savedRoutes = sessionStorage.getItem('route_results');
        return savedRoutes ? JSON.parse(savedRoutes) : null;
    });

    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('route_originId', originId);
    }, [originId]);

    useEffect(() => {
        sessionStorage.setItem('route_destinationId', destinationId);
    }, [destinationId]);

    useEffect(() => {
        if (routes) {
            sessionStorage.setItem('route_results', JSON.stringify(routes));
        } else {
            // Only remove if explicitly null (new search started), 
            // but for persistence usually we want to keep the last valid result until a new one is found.
            // keeping it simple: if routes is null, remove it.
        }
    }, [routes]);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Fetch stations on mount
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const data = await getAllStations();
                // Check if data is array or object with stations property
                const stationsList = Array.isArray(data) ? data : (data.stations || []);
                setStations(stationsList);
            } catch (error) {
                console.error("Failed to fetch stations", error);
                toast({
                    title: "Lỗi tải dữ liệu",
                    description: "Không thể tải danh sách nhà ga.",
                    variant: "destructive"
                });
            }
        };
        fetchStations();
    }, []);

    const handleSearch = async () => {
        if (!originId || !destinationId) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng chọn điểm đi và điểm đến.",
                variant: 'destructive'
            });
            return;
        }

        if (originId === destinationId) {
            toast({
                title: "Thông tin không hợp lệ",
                description: "Điểm đi và điểm đến không được trùng nhau.",
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        setRoutes(null);

        try {
            const originStation = stations.find(s => s._id === originId || s.id === originId);
            const destStation = stations.find(s => s._id === destinationId || s.id === destinationId);

            if (!originStation || !destStation) return;

            // Using names/IDs as per API requirement. 
            const result = await searchRoutes(originStation.name, destStation.name);
            setRoutes(result);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                toast({
                    title: "Không tìm thấy lộ trình",
                    description: "Hiện chưa có tuyến đường phù hợp giữa hai điểm này.",
                });
            }

        } catch (error: any) {
            console.error("Search failed", error);
            toast({
                title: "Tìm kiếm thất bại",
                description: error.message || "Đã có lỗi xảy ra khi tìm kiếm lộ trình.",
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        const temp = originId;
        setOriginId(destinationId);
        setDestinationId(temp);
    };

    const handleBuyTicket = () => {
        if (!routes || !routes.path) return;

        const originStation = stations.find(s => s._id === originId || s.id === originId);
        const destStation = stations.find(s => s._id === destinationId || s.id === destinationId);

        navigate('/payment', {
            state: {
                fare: routes.fare,
                origin: originStation ? originStation.name : '',
                destination: destStation ? destStation.name : '',
                quantities: 1, // Default
                route: routes.path, // Array of station strings
                ticketType: 'luot', // One-way ticket default
                discountPercent: 0
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tra cứu lộ trình & Mua vé
                        </h1>
                        <p className="text-muted-foreground">
                            Tìm kiếm tuyến đường nhanh nhất và mua vé trực tuyến dễ dàng
                        </p>
                    </div>

                    {/* Search Card */}
                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 w-full" />
                        <CardContent className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto] gap-4 items-end">

                                {/* Origin Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        Điểm đi
                                    </label>
                                    <Select value={originId} onValueChange={setOriginId}>
                                        <SelectTrigger className="h-12 border-gray-200 focus:ring-blue-500 bg-white">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                <SelectValue placeholder="Chọn ga đi" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stations.map(station => (
                                                <SelectItem key={station._id || station.id} value={station._id || station.id}>
                                                    {station.nameVi || station.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center md:pb-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleSwap}
                                        className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <ArrowLeftRight className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Destination Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        Điểm đến
                                    </label>
                                    <Select value={destinationId} onValueChange={setDestinationId}>
                                        <SelectTrigger className="h-12 border-gray-200 focus:ring-red-500 bg-white">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin className="h-4 w-4 text-red-500" />
                                                <SelectValue placeholder="Chọn ga đến" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stations.map(station => (
                                                <SelectItem key={station._id || station.id} value={station._id || station.id}>
                                                    {station.nameVi || station.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Button */}
                                <Button
                                    size="lg"
                                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-105"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="animate-spin mr-2">⏳</span>
                                    ) : (
                                        <Search className="mr-2 h-5 w-5" />
                                    )}
                                    Tìm kiếm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    {routes && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Milestone className="h-5 w-5 text-blue-600" />
                                Kết quả tìm kiếm
                            </h2>

                            <Card className="border-blue-100 shadow-md overflow-hidden">
                                <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <Train className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Lộ trình tối ưu</h3>
                                            <p className="text-sm text-gray-500">Tuyến số 1 (Bến Thành - Suối Tiên)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {routes.fare?.toLocaleString('vi-VN')}đ
                                        </div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Giá vé / lượt</p>
                                    </div>
                                </div>

                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                        {/* Journey Info */}
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm ring-4 ring-blue-50" />
                                                    <div className="w-0.5 h-12 bg-gray-200 mx-auto my-1" />
                                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm ring-4 ring-red-50" />
                                                </div>
                                                <div className="flex-1 space-y-8">
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase">Khởi hành</p>
                                                        <p className="font-medium text-gray-900">
                                                            {stations.find(s => s._id === originId || s.id === originId)?.nameVi}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase">Điểm đến</p>
                                                        <p className="font-medium text-gray-900">
                                                            {stations.find(s => s._id === destinationId || s.id === destinationId)?.nameVi}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="p-6 flex flex-col justify-center space-y-4 bg-gray-50/30">
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Clock className="h-5 w-5 text-orange-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Thời gian dự kiến</p>
                                                    <p className="font-semibold">{routes.duration || '25'} phút</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Ticket className="h-5 w-5 text-green-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Số trạm đi qua</p>
                                                    <p className="font-semibold">{(routes.path?.length || 0) - 1} trạm</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-6 flex flex-col justify-center items-center space-y-3">
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 h-10 shadow-sm group"
                                                onClick={handleBuyTicket}
                                            >
                                                Mua vé ngay
                                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full text-gray-600"
                                                onClick={() => setShowMap(!showMap)}
                                            >
                                                {showMap ? 'Ẩn bản đồ' : 'Xem trên bản đồ'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Visual Route Steps (Simplified) */}
                                    <div className="bg-gray-50 p-4 border-t border-gray-100 overflow-x-auto">
                                        <div className="flex items-center min-w-max px-2">
                                            {routes.path?.map((stationName, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full border-2 ${index === 0 ? 'bg-blue-500 border-blue-500' :
                                                            index === routes.path.length - 1 ? 'bg-red-500 border-red-500' :
                                                                'bg-white border-blue-300'
                                                            }`} />
                                                        <span className={`text-xs font-medium whitespace-nowrap ${index === 0 || index === routes.path.length - 1 ? 'text-gray-900' : 'text-gray-500'
                                                            }`}>
                                                            {stationName}
                                                        </span>
                                                    </div>
                                                    {index < routes.path.length - 1 && (
                                                        <div className="h-0.5 w-12 bg-blue-200 mx-1 mb-5" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Map Integration */}
                    {showMap && (
                        <div className="animate-in fade-in duration-500 mt-8 rounded-xl overflow-hidden shadow-lg border">
                            <MetroMap />
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RouteExplorer;
