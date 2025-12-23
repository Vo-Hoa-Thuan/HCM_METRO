
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActiveStations, Station } from '@/api/stationsApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Hero = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getActiveStations();
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch stations", error);
      }
    };
    fetchStations();
  }, []);

  const handleSearch = () => {
    if (origin && destination) {
      if (origin === destination) {
        // Could show toast here, but simple return is okay for Hero
        return;
      }
      navigate(`/routes?origin=${origin}&destination=${destination}`);
    }
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 aspect-square bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-slide-down">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
            Tàu Điện Metro TP.HCM
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Di chuyển thông minh <br className="hidden sm:block" />
            <span className="text-accent">nhanh chóng &amp; tiện lợi</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ứng dụng hỗ trợ người dân và du khách tìm kiếm lộ trình, thông tin vé và dịch vụ của hệ thống tàu điện metro TP.HCM.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/map">
                <MapPin className="h-4 w-4" />
                Xem bản đồ metro
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/routes">
                Tìm lộ trình
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Route Planner Card */}
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg border border-border overflow-hidden animate-slide-up">
          <Tabs defaultValue="route" className="w-full">
            <div className="px-6 pt-6 border-b">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="route" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Lộ trình
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Lịch trình
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="route" className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đi</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger className="pl-10 metro-input text-left">
                        <SelectValue placeholder="Chọn điểm đi" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="pl-10 metro-input text-left">
                        <SelectValue placeholder="Chọn điểm đến" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">Tìm kiếm</label>
                  <Button className="w-full" size="default" onClick={handleSearch}>
                    <ArrowRight className="h-4 w-4" />
                    Tìm đường
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="p-6 space-y-4">
              {/* Keep schedule content as placeholder or minimal updates */}
              <div className="text-center text-muted-foreground py-8">
                Tính năng tra cứu lịch trình đang được phát triển.
                <br />
                Vui lòng quay lại sau.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hero;
