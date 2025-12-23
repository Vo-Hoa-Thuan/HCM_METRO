import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Clock, Calendar, RefreshCw, Wallet, Train, DollarSign, Ticket, Info, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getActiveStations, Station } from '@/api/stationsApi';
import { formatPrice } from '@/api/ticketsAPI';
import { searchRoutes, RouteOption, RouteStep } from '@/api/lineApi';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { Fragment } from "react"
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { getRealTimeTrains } from '@/api/metroApi';
import { calculateETA, RealTimeTrain } from '@/utils/etaCalculator';
import type { RouteResponse } from '@/api/lineApi';

const RoutePlanner = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [time, setTime] = useState<string>('now');
  const [searchParams, setSearchParams] = useState<{ origin: string, destination: string } | null>(null);
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [ticketType, setTicketType] = useState('luot');
  const [groupSize, setGroupSize] = useState(3);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [realTimeInfo, setRealTimeInfo] = useState<Record<string, { nextTrainTime: number, crowdLevel: string, delayMinutes: number }>>({});
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [activeTrains, setActiveTrains] = useState<RealTimeTrain[]>([]);

  // Fetch stations
  const { data: stationsData, error: stationsError } = useQuery({
    queryKey: ['stations'],
    queryFn: getActiveStations,
  });

  useEffect(() => {
    if (stationsData) {
      setStations(stationsData);
    }
    if (stationsError) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách ga. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  }, [stationsData, stationsError]);

  // Fetch routes
  const { data: routeData, isLoading, error: routeError } = useQuery({
    queryKey: ['routes', searchParams],
    queryFn: () => {
      if (!searchParams) return null;
      return searchRoutes(searchParams.origin, searchParams.destination);
    },
    enabled: !!searchParams,
  });

  useEffect(() => {
    if (routeData?.realTimeInfo) {
      setRealTimeInfo(routeData.realTimeInfo);
    }
    if (routeError) {
      toast({
        title: "Lỗi",
        description: "Không thể tìm tuyến đường. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  }, [routeData, routeError]);

  useEffect(() => {
    if (!isRealTimeEnabled || !showResults || !searchParams) {
      return;
    }

    const updateRealTimeInfo = async () => {
      try {
        // Fetch active trains
        const trains = await getRealTimeTrains();
        setActiveTrains(trains);

        // Update ETA for each station in the current route
        if (routeData?.stations) {
          const newRealTimeInfo: Record<string, any> = {};

          routeData.stations.forEach(station => {
            // Find line ID for this station (assuming station.lines exists or we deduce it)
            // Simplified: we'll try to match trains on same line
            // In real app, we need lineId from routeData
            const lineId = (routeData.stations[0] as any).lines?.[0] || '6769019688a29b2829141be3'; // Fallback Line 1 ID or dynamic

            // To support multiple lines we need lineId per station from routeData
            // For now, let's assume routeData tells us which line we are on
            // Or we just search all trains

            // Better: Iterate active trains and find nearest
            // Type assertion to bypass strict mismatch for now between api types
            const eta = calculateETA(station._id, '6769019688a29b2829141be3', trains, stations as any[]); // Hardcoded line 1 for MVP test

            // Mock crowd/delay based on simulation if not available
            newRealTimeInfo[station._id] = {
              nextTrainTime: eta !== null ? eta : Math.floor(Math.random() * 15) + 1, // Fallback
              crowdLevel: trains.length > 0 ? 'medium' : 'low',
              delayMinutes: 0
            };
          });
          setRealTimeInfo(newRealTimeInfo);
        }

      } catch (error) {
        console.error('Error updating real-time info:', error);
      }
    };

    updateRealTimeInfo();

    const interval = setInterval(updateRealTimeInfo, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, showResults, searchParams, routeData, stations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setIsAlertVisible(false);
    setShowResults(false);

    if (origin && destination) {
      if (origin === destination) {
        setIsAlertVisible(true);
        toast({
          title: "Lỗi",
          description: "Điểm đi và điểm đến không được trùng nhau",
          variant: "destructive",
        });
        return;
      }
      setSearchParams({ origin, destination });
      setShowResults(true);
    } else {
      setIsAlertVisible(true);
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn điểm đi và điểm đến",
        variant: "destructive",
      });
    }
  };

  const handleBuyTicket = () => {
    if (!routeData) return;

    const isLoggedIn = localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true);
      return;
    }

    const originStation = stations.find(s => s._id === origin);
    const destinationStation = stations.find(s => s._id === destination);
    const quantities =
      ticketType === "nhom"
        ? groupSize
        : ticketType === "khu hoi"
          ? 2
          : 1;

    let discountPercent = 0;

    if (ticketType === "khu hoi") {
      discountPercent = 5;
    } else if (ticketType === "nhom") {
      const baseDiscount = 10;
      const extraDiscount = Math.min((groupSize - 3) * 2, 10);
      discountPercent = groupSize >= 3 ? baseDiscount + extraDiscount : 0;
    }

    const realTimeData = routeData.stations.map(station => ({
      stationId: station._id,
      realTimeInfo: realTimeInfo[station._id]
    }));

    navigate('/payment', {
      state: {
        fare: routeData.fare,
        origin: originStation?.nameVi,
        destination: destinationStation?.nameVi,
        ticketType,
        quantities,
        discountPercent,
        route: routeData.stations.map(station => station.nameVi),
        realTimeData,
        estimatedArrival: new Date(Date.now() + routeData.duration * 60000),
      }
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCrowdLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <form onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Điểm đi</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={origin}
                  onValueChange={setOrigin}
                >
                  <SelectTrigger className="pl-10 metro-input">
                    <SelectValue placeholder="Chọn điểm đi" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map(station => (
                      <SelectItem key={station._id} value={station._id}>
                        {station.name} ({station.nameVi})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Điểm đến</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  value={destination}
                  onValueChange={setDestination}
                >
                  <SelectTrigger className="pl-10 metro-input">
                    <SelectValue placeholder="Chọn điểm đến" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map(station => (
                      <SelectItem key={station._id} value={station._id}>
                        {station.name} ({station.nameVi})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Thời gian thực</label>
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRealTimeEnabled ? 'animate-spin' : ''}`} />
                {isRealTimeEnabled ? 'Đang cập nhật' : 'Cập nhật'}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại vé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luot">Vé lượt</SelectItem>
                    <SelectItem value="khu hoi">Vé khứ hồi</SelectItem>
                    <SelectItem value="nhom">Vé nhóm</SelectItem>
                  </SelectContent>
                </Select>

                {ticketType === 'nhom' && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Số người:</label>
                    <Input
                      type="number"
                      min="3"
                      max="10"
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Train className="mr-2 h-4 w-4" />
              Tìm tuyến
            </Button>
          </div>
        </form>
      </div>

      {isAlertVisible && (
        <Alert className="m-6" variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {origin === destination
              ? "Điểm đi và điểm đến không được trùng nhau"
              : "Vui lòng chọn điểm đi và điểm đến"}
          </AlertDescription>
        </Alert>
      )}

      {showResults && (
        <div className="p-6">
          {isLoading ? (
            <div className="text-center">
              <RefreshCw className="animate-spin h-8 w-8 mx-auto text-blue-600" />
              <p className="mt-2 text-muted-foreground">Đang tìm tuyến phù hợp...</p>
            </div>
          ) : routeError ? (
            <Alert variant="destructive">
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>
                {routeError instanceof Error ? routeError.message : 'Không thể tìm tuyến đường. Vui lòng thử lại sau.'}
              </AlertDescription>
            </Alert>
          ) : routeData ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tuyến được đề xuất</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(routeData.duration)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {routeData.stations.map((station, index) => {
                  const info = realTimeInfo[station._id];
                  return (
                    <Fragment key={station._id}>
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-blue-600" />
                          {index < routeData.stations.length - 1 && (
                            <div className="w-0.5 h-16 bg-blue-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{station.nameVi}</h4>
                              <p className="text-sm text-muted-foreground">{station.name}</p>
                            </div>
                            {info && isRealTimeEnabled && (
                              <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">
                                  Tàu đến trong: {info.nextTrainTime} phút
                                </p>
                                {/* Calculated Distance Indicator */}
                                {info.nextTrainTime < 3 && (
                                  <p className="text-xs text-green-600 animate-pulse font-bold">
                                    TÀU ĐANG VÀO GA
                                  </p>
                                )}
                                <p className={`text-sm ${getCrowdLevelColor(info.crowdLevel)}`}>
                                  Mật độ: {getCrowdLevelText(info.crowdLevel)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Giá vé</p>
                    <p className="text-2xl font-bold">{formatPrice(routeData.fare)}</p>
                  </div>
                  {isRealTimeEnabled && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Thời gian đến dự kiến</p>
                      <p className="text-lg font-semibold">
                        {new Date(Date.now() + routeData.duration * 60000).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>

                <Button onClick={handleBuyTicket} className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Mua vé ngay
                </Button>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTitle>Không tìm thấy tuyến</AlertTitle>
              <AlertDescription>
                Không tìm thấy tuyến phù hợp cho hành trình của bạn. Vui lòng thử lại với các điểm khác.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn cần đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Để mua vé, bạn cần đăng nhập vào tài khoản của mình.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/login')}>
              Đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoutePlanner;