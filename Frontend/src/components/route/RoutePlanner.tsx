
import { useState, useEffect} from 'react';
import { MapPin, ArrowRight, Clock, Calendar, RefreshCw, Wallet, Train, DollarSign, Ticket, Info, ShoppingCart} from 'lucide-react';
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
import { getActiveStations, getStationById, Station } from '@/api/stationsApi';
import { formatPrice } from '@/api/ticketsAPI';
import { searchRoutes, RouteOption, RouteStep} from '@/api/lineApi';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { Fragment } from "react" 
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';


const RoutePlanner = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [time, setTime] = useState<string>('now');
  const [searchParams, setSearchParams] = useState<{origin: string, destination: string} | null>(null);
  const { toast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const navigate = useNavigate(); 
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [ticketType, setTicketType] = useState('luot');
  const [groupSize, setGroupSize] = useState(3);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);

  
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await getActiveStations(); 
        setStations(response);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };

    fetchStations();
  }, []);

  // GetStationById 
  // useEffect(() => {
  //   const fetchStations = async () => {
  //     try {
  //       const response = await getStationById(''); 
  //       setStations(response);
  //     } catch (error) {
  //       console.error('Error fetching stations:', error);
  //     }
  //   };

  //   fetchStations();
  // }, []);

  
  const { data: routeData, isLoading, error } = useQuery({
    queryKey: ['routes', searchParams],
    queryFn: () => searchParams ? searchRoutes(
      searchParams.origin,
      searchParams.destination
    ) : Promise.resolve(null),
    enabled: !!searchParams,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Tắt Alert khi bắt đầu tìm kiếm mới
    setIsAlertVisible(false);
    setShowResults(false); // Ẩn kết quả tìm kiếm
  
    if (origin && destination) {
      if (origin === destination) {
        setIsAlertVisible(true); // Hiển thị Alert nếu điểm đi và điểm đến trùng nhau
        return;
      }
      setSearchParams({ origin, destination });
      setShowResults(true); // Hiển thị kết quả tìm kiếm khi có dữ liệu
      console.log('Searching routes with:', { origin, destination });
    } else {
      setIsAlertVisible(true); // Hiển thị Alert nếu thiếu thông tin
    }
  };
  
  const handleBuyTicket = () => {
    const isLoggedIn = localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      setIsLoginDialogOpen(true);
    } else {
      // Lấy tên ga bắt đầu và kết thúc
      const originStation = stations.find(s => s._id === origin);
      const destinationStation = stations.find(s => s._id === destination);
      const quantities =
      ticketType === "nhom"
        ? groupSize
        : ticketType === "khu hoi"
        ? 2
        : 1;
          
      let ticketCount = 1;
      let discountPercent = 0; 

      if (ticketType === "khu hoi") {
        ticketCount = 2;
        discountPercent = 5; 
      } else if (ticketType === "nhom") {
        ticketCount = groupSize;
        const baseDiscount = 10;
        const extraDiscount = Math.min((groupSize - 3) * 2, 10);
        discountPercent = groupSize >= 3 ? baseDiscount + extraDiscount : 0;
      }
  

      navigate('/payment', {
        state: {
          fare: routeData?.fare,
          origin: originStation?.nameVi,
          destination: destinationStation?.nameVi,
          ticketType,
          quantities,
          discountPercent,
          route: routeData?.stations.map(station => station.nameVi),
        }
      });
  
      console.log('Navigating to payment with:', {
        fare: routeData?.fare,
        origin: originStation?.nameVi,
        destination: destinationStation?.nameVi,
        ticketType,
        quantities,
        discountPercent,
        route: routeData?.stations.map(station => station.nameVi),
      });
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
  };

  if (error) {
    console.error('Error fetching routes:', error);
  }

  return (
    <div className="bg-white rounded-xl border shadow-md overflow-hidden">
      {/* Search form */}
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
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-1">Thời gian khởi hành</label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="metro-input">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Khởi hành ngay</SelectItem>
                  <SelectItem value="later">Chọn thời gian</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div> 
            {time !== 'now' && (
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Ngày</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    className="pl-10 metro-input" 
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Giờ</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="time" 
                    className="pl-10 metro-input" 
                    defaultValue={new Date().toTimeString().slice(0, 5)} 
                  />
                </div>
              </div>
            </div>
            )}
          
          
          <div className="flex justify-center mt-6">
            <Button 
              type="submit" 
              className="gap-2 w-full md:w-auto"
              disabled={!origin || !destination || isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang tìm lộ trình...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Tìm lộ trình
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {isAlertVisible && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Điểm đi và điểm đến không thể trùng nhau</AlertTitle>
          <AlertDescription>
            Vui lòng chọn hai ga khác nhau để tìm lộ trình.
          </AlertDescription>
        </Alert>
      )}

  {showResults && (
  <div className="p-6 animate-fade-in space-y-6 bg-white rounded-xl shadow">
    <h3 className="font-semibold text-xl text-blue-900">
      {isLoading
        ? 'Đang tìm kiếm...'
        : error
        ? 'Đã xảy ra lỗi khi tìm kiếm'
        : routeData
        ? 'Lộ trình được đề xuất'
        : 'Không tìm thấy lộ trình phù hợp'}
    </h3>

    {error && (
      <div className="p-4 border border-red-400 text-red-600 bg-red-50 rounded-md text-sm">
        Không thể kết nối tới server. Vui lòng thử lại sau.
      </div>
    )}

    {routeData && (
      <div className="bg-blue-50 rounded-2xl p-6 space-y-6 shadow-inner">
        {/* Route Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-blue-600" />
            <span>Số ga đi qua: <strong>{routeData.stations.length}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>Tiền vé: <strong>{formatPrice(routeData.fare)}</strong></span>
          </div>
        </div>

        {/* Station List */}
        <div className="flex flex-wrap justify-center gap-2">
          {routeData.stations.map((station, index) => (
            <Fragment key={station._id}>
              <div className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                Ga {station.nameVi}
              </div>
              {index !== routeData.stations.length - 1 && (
                <span className="text-blue-400 text-lg">→</span>
              )}
            </Fragment>
          ))}
        </div>

        {/* Ticket and Buy button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-blue-200 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-sm text-blue-700">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span>Loại vé:</span>
            <select
              className="bg-white border border-blue-300 rounded px-3 py-1 text-sm text-blue-900"
              value={ticketType}
              onChange={(e) => {
                setTicketType(e.target.value);
                if (e.target.value === "nhom" && groupSize < 3) {
                  setGroupSize(3); 
                }
              }}
            >
              <option value="luot">Vé lượt</option>
              <option value="khu hoi">Vé khứ hồi</option>
              <option value="nhom">Vé nhóm</option>
            </select>
          </div>

          {/* Nếu chọn vé nhóm thì hiện thêm phần chọn số lượng */}
          {ticketType === "nhom" && (
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span>Số lượng vé:</span>
              <div className="flex items-center border border-blue-300 rounded">
                <button
                  className="px-2 py-1 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  onClick={() => setGroupSize(prev => Math.max(3, prev - 1))}
                  disabled={groupSize <= 3}
                >
                  −
                </button>
                <span className="px-3 py-1 bg-blue-50 text-blue-800">{groupSize}</span>
                <button
                  className="px-2 py-1 text-blue-600 hover:bg-blue-100"
                  onClick={() => setGroupSize(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleBuyTicket}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua vé ngay
          </button>
        </div>

      </div>
    )}
  </div>
)}

      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yêu cầu đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần đăng nhập để tiếp tục mua vé. Vui lòng đăng nhập để tiếp tục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsLoginDialogOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsLoginDialogOpen(false);
                navigate('/login');
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoutePlanner;