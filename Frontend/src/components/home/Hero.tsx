
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Hero = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
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
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Chọn điểm đi" 
                      className="pl-10 metro-input"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Chọn điểm đến" 
                      className="pl-10 metro-input"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">Tìm kiếm</label>
                  <Button className="w-full" size="default">
                    <ArrowRight className="h-4 w-4" />
                    Tìm đường
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      className="pl-10 metro-input"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến</label>
                  <select className="metro-input">
                    <option value="">Chọn tuyến tàu</option>
                    <option value="red">Tuyến Đỏ (Bến Thành - Suối Tiên)</option>
                    <option value="blue">Tuyến Xanh (Bến Thành - Tham Lương)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 opacity-0">Tìm kiếm</label>
                  <Button className="w-full" size="default">
                    <Clock className="h-4 w-4 mr-2" />
                    Xem lịch
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hero;
