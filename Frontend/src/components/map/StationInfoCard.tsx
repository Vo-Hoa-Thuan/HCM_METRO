
import React, { useState } from 'react';
import { MapPin, Clock, Info, Users, Wifi, Landmark, Coffee, Bus, Calendar, ChevronRight, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Station, MetroLine, getLineById } from '@/utils/metroData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface StationInfoCardProps {
  station: Station;
  lines: MetroLine[];
  onClick?: () => void;
  className?: string;
}

const StationInfoCard: React.FC<StationInfoCardProps> = ({ 
  station, 
  lines,
  onClick,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get all connected lines for this station
  const connectedLines = station.lines.map(lineId => 
    lines.find(line => line.id === lineId)
  ).filter(Boolean) as MetroLine[];

  // Map facility codes to readable names and icons
  const facilityIcons: Record<string, { name: string; icon: JSX.Element }> = {
    'elevator': { 
      name: 'Thang máy', 
      icon: <Users className="h-4 w-4" /> 
    },
    'ticket-office': { 
      name: 'Quầy vé', 
      icon: <Landmark className="h-4 w-4" /> 
    },
    'ticket-machine': { 
      name: 'Máy bán vé', 
      icon: <Landmark className="h-4 w-4" /> 
    },
    'restroom': { 
      name: 'Nhà vệ sinh', 
      icon: <Info className="h-4 w-4" /> 
    },
    'wifi': { 
      name: 'Wifi miễn phí', 
      icon: <Wifi className="h-4 w-4" /> 
    },
    'cafe': { 
      name: 'Quán cà phê', 
      icon: <Coffee className="h-4 w-4" /> 
    },
    'bus': { 
      name: 'Bến xe bus', 
      icon: <Bus className="h-4 w-4" /> 
    },
  };

  return (
    <>
      <Card 
        className={`hover:shadow-md transition-shadow ${className}`}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{station.nameVi}</CardTitle>
              <p className="text-sm text-muted-foreground">{station.name}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {station.isInterchange && (
                <Badge className="bg-amber-500">Trạm chuyển tuyến</Badge>
              )}
              {station.isDepot && (
                <Badge variant="outline">Depot</Badge>
              )}
              {station.isUnderground && (
                <Badge variant="outline">Ngầm</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground gap-1 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {station.coordinates[1].toFixed(6)}, {station.coordinates[0].toFixed(6)}
            </span>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Tuyến Metro:</p>
            <div className="flex flex-wrap gap-2">
              {connectedLines.map(line => (
                <div 
                  key={line.id} 
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                  style={{ 
                    backgroundColor: `${line.color}20`,
                    color: line.color 
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: line.color }}
                  ></div>
                  <span>{line.nameVi}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 rounded p-2">
              <div className="flex items-center gap-1.5 text-xs mb-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Giờ hoạt động</span>
              </div>
              <p className="text-xs text-muted-foreground">05:30 - 22:30</p>
            </div>
            
            <div className="bg-gray-50 rounded p-2">
              <div className="flex items-center gap-1.5 text-xs mb-1">
                <CalendarClock className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Tần suất</span>
              </div>
              <p className="text-xs text-muted-foreground">5-10 phút</p>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div>
            <p className="text-sm font-medium mb-2">Tiện ích:</p>
            <div className="grid grid-cols-2 gap-2">
              {station.facilities.map(facility => (
                <div key={facility} className="flex items-center gap-1.5 text-xs">
                  {facilityIcons[facility]?.icon || <Info className="h-4 w-4" />}
                  <span>{facilityIcons[facility]?.name || facility}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
            >
              Xem chi tiết trạm
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{station.nameVi}</DialogTitle>
            <DialogDescription>{station.name}</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
              <TabsTrigger value="facilities">Tiện ích</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="flex items-center gap-2 text-sm mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {station.coordinates[1].toFixed(6)}, {station.coordinates[0].toFixed(6)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3">
                  <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Trạng thái</h4>
                  <div className="space-y-1">
                    {station.isInterchange && (
                      <Badge className="bg-amber-500">Trạm chuyển tuyến</Badge>
                    )}
                    {station.isDepot && (
                      <Badge variant="outline">Depot</Badge>
                    )}
                    {station.isUnderground && (
                      <Badge variant="outline">Ngầm</Badge>
                    )}
                    
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đang hoạt động</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Tuyến Metro</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {connectedLines.map(line => (
                      <div 
                        key={line.id} 
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                        style={{ 
                          backgroundColor: `${line.color}20`,
                          color: line.color 
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: line.color }}
                        ></div>
                        <span>{line.nameVi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Mô tả</h4>
                <p className="text-sm text-muted-foreground">
                  {station.nameVi} là một trạm thuộc hệ thống Metro TP.HCM.
                  {station.isInterchange && " Đây là trạm chuyển tuyến cho nhiều tuyến Metro."}
                  {station.isDepot && " Trạm này cũng là depot phục vụ bảo trì và lưu trữ đoàn tàu."}
                  {station.isUnderground && " Trạm này được xây dựng ngầm dưới lòng đất."}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4">
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Giờ hoạt động</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Ngày thường:</p>
                    <p className="text-muted-foreground">05:30 - 22:30</p>
                  </div>
                  <div>
                    <p className="font-medium">Cuối tuần:</p>
                    <p className="text-muted-foreground">06:00 - 22:00</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Tần suất tàu</h4>
                <div className="space-y-3">
                  {connectedLines.map(line => (
                    <div key={line.id} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: line.color }}
                        ></div>
                        <span className="text-sm font-medium">{line.nameVi}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pl-5">
                        <div>
                          <p className="text-muted-foreground">Giờ cao điểm:</p>
                          <p>{line.frequency?.peakHours || "5-6 phút"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Giờ thường:</p>
                          <p>{line.frequency?.offPeakHours || "10-15 phút"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Lịch tàu gần nhất</h4>
                <div className="space-y-2">
                  {connectedLines.slice(0, 2).map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: line.color }}
                        ></div>
                        <span>{line.nameVi}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{Math.floor(Math.random() * 5) + 1} phút</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facilities" className="space-y-4">
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Tiện ích tại trạm</h4>
                <div className="grid grid-cols-2 gap-3">
                  {station.facilities.map(facility => (
                    <div key={facility} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="bg-primary/10 p-1.5 rounded">
                        {facilityIcons[facility]?.icon || <Info className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{facilityIcons[facility]?.name || facility}</p>
                        <p className="text-xs text-muted-foreground">
                          {facility === 'elevator' && 'Tiếp cận cho xe lăn'}
                          {facility === 'ticket-office' && 'Mở cửa từ 6:00-21:00'}
                          {facility === 'ticket-machine' && 'Sử dụng 24/7'}
                          {facility === 'restroom' && 'Mở cửa trong giờ hoạt động'}
                          {facility === 'wifi' && 'Miễn phí cho khách hàng'}
                          {facility === 'cafe' && 'Mở cửa từ 6:00-21:00'}
                          {facility === 'bus' && 'Kết nối nhiều tuyến bus'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="text-xs uppercase text-muted-foreground font-medium mb-2">Trợ giúp đặc biệt</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Nhân viên hỗ trợ: Có mặt từ 5:30-22:30</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-primary" />
                    <span>Quầy thông tin: Tại sảnh chính</span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto gap-1" 
              onClick={() => setShowDetails(false)}
            >
              Đóng
            </Button>
            <Button 
              className="w-full sm:w-auto gap-1"
            >
              Chỉ đường đến trạm
              <MapPin className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StationInfoCard;
