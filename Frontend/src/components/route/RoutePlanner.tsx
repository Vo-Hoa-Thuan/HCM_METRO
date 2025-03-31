
import { useState } from 'react';
import { MapPin, ArrowRight, Clock, Calendar, RefreshCw, Wallet, Train } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stations, getStationById, formatPrice } from '@/utils/metroData';
import { searchRoutes, RouteOption, RouteStep } from '@/api/metroApi';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const RoutePlanner = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [time, setTime] = useState<string>('now');
  const [searchParams, setSearchParams] = useState<{origin: string, destination: string, time: string} | null>(null);
  const { toast } = useToast();
  
  const { data: routeOptions = [], isLoading, error } = useQuery({
    queryKey: ['routes', searchParams],
    queryFn: () => searchParams ? searchRoutes(
      searchParams.origin,
      searchParams.destination, 
      searchParams.time
    ) : Promise.resolve([]),
    enabled: !!searchParams,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      setSearchParams({ origin, destination, time });
      console.log('Searching routes with:', { origin, destination, time });
    } else {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn điểm đi và điểm đến",
        variant: "destructive",
      });
    }
  };

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

  const showResults = searchParams !== null;

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
                      <SelectItem key={station.id} value={station.id}>
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
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} ({station.nameVi})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Thời gian</label>
              <Select 
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Ngay bây giờ</SelectItem>
                  <SelectItem value="depart">Giờ khởi hành</SelectItem>
                  <SelectItem value="arrive">Giờ đến</SelectItem>
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
      
      {/* Results */}
      {showResults && (
        <div className="p-6 animate-fade-in">
          <h3 className="font-medium text-lg mb-6">
            {isLoading ? 'Đang tìm kiếm...' : 
              error ? 'Đã xảy ra lỗi khi tìm kiếm' : 
              `Kết quả tìm kiếm (${routeOptions.length})`}
          </h3>
          
          {error && (
            <div className="p-4 border border-destructive text-destructive rounded-md">
              Không thể kết nối tới server. Vui lòng thử lại sau.
            </div>
          )}
          
          {!isLoading && !error && routeOptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy lộ trình phù hợp với yêu cầu của bạn.
            </div>
          )}
          
          <div className="space-y-6">
            {routeOptions.map((route) => (
              <div 
                key={route.id} 
                className="bg-secondary rounded-lg p-4 hover:bg-secondary/80 transition-colors"
              >
                {/* Route header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <span>{route.departureTime}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span>{route.arrivalTime}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDuration(route.totalDuration)} · {route.totalDistance.toFixed(1)} km
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">{formatPrice(route.price)}</div>
                    <Button variant="outline" size="sm" className="mt-2 gap-1">
                      <Wallet className="h-4 w-4" />
                      Mua vé
                    </Button>
                  </div>
                </div>
                
                {/* Route steps */}
                <div className="space-y-3">
                  {route.steps.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      {/* Step icon */}
                      {step.type === 'walk' ? (
                        <div className="mt-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <MapPin className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className={`mt-1 h-6 w-6 rounded-full bg-metro-${step.line} flex items-center justify-center`}>
                          <Train className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      {/* Step details */}
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {step.type === 'walk' ? (
                            <>Đi bộ {step.distance.toFixed(1)} km</>
                          ) : (
                            <>Tàu {step.line === 'red' ? 'đỏ' : 'xanh'}</>
                          )}
                          <span className="text-muted-foreground ml-2">
                            ({formatDuration(step.duration)})
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {step.from} → {step.to}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
