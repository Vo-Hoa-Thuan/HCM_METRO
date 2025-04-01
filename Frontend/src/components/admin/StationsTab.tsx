
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2,
  LayoutGrid,
  ListFilter,
  MapPin,
  Train,
  Clock,
  Wifi,
  ShoppingBag,
  CreditCard,
  Utensils,
  Baby,
  Plus,
  ImageIcon,
  AccessibilityIcon
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { metroLines, stations } from "@/utils/metroData";
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";

interface StationsTabProps {
  searchTerm: string;
}

const StationsTab = ({ searchTerm }: StationsTabProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredStations = stations.filter(
    (station) =>
      station.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get metro line color by ID
  const getLineColor = (lineId: string) => {
    const line = metroLines.find(line => line.id === lineId);
    return line ? line.color : "#ccc";
  };

  // Generate facility icon
  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      case "wheelchair":
      case "elevator":
        return <AccessibilityIcon className="h-4 w-4" />;
      case "ticketing":
      case "ticket-office":
      case "ticket-machine":
        return <CreditCard className="h-4 w-4" />;
      case "food":
      case "restroom":
        return <Utensils className="h-4 w-4" />;
      case "childcare":
        return <Baby className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm"
            className="flex items-center gap-1 h-9"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Lưới</span>
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm"
            className="flex items-center gap-1 h-9"
            onClick={() => setViewMode("list")}
          >
            <ListFilter className="h-4 w-4" />
            <span className="hidden sm:inline">Danh sách</span>
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="hover-3d overflow-hidden">
                <div className="bg-muted h-36 relative">
                  {station.image ? (
                    <img 
                      src={station.image} 
                      alt={station.nameVi} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex flex-wrap gap-1">
                      {station.lines.map(lineId => (
                        <Badge 
                          key={lineId}
                          style={{ backgroundColor: getLineColor(lineId) }}
                          className="text-white"
                        >
                          Tuyến {lineId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {station.nameVi}
                      </CardTitle>
                      <CardDescription>{station.name}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="info" className="text-xs">Thông tin</TabsTrigger>
                      <TabsTrigger value="schedule" className="text-xs">Lịch trình</TabsTrigger>
                      <TabsTrigger value="facilities" className="text-xs">Tiện ích</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="pt-3 pb-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <span className="text-muted-foreground">
                            {station.address || "Chưa có thông tin địa chỉ"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <Train className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <span className="text-muted-foreground">
                            {station.isInterchange 
                              ? "Trạm chuyển tuyến" 
                              : "Trạm thường"}
                            {station.isDepot && ", Depot"}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="schedule" className="pt-3 pb-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                          <div>
                            <div className="text-muted-foreground">Giờ mở cửa:</div>
                            <div>05:00 - 23:00</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t pt-2 mt-2">
                          <span className="text-muted-foreground">Giờ cao điểm:</span>
                          <span>3-5 phút/chuyến</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Giờ thường:</span>
                          <span>7-10 phút/chuyến</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="facilities" className="pt-3 pb-1">
                      <div className="grid grid-cols-3 gap-2">
                        {station.facilities.map((facility, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center p-1">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-1">
                              {getFacilityIcon(facility)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {facility}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredStations.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <Card className="hover-3d">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{station.nameVi}</h3>
                      <p className="text-sm text-muted-foreground">{station.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mr-2">
                      <div className="flex">
                        {station.lines.map(lineId => (
                          <div 
                            key={lineId} 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white text-xs -ml-1 first:ml-0"
                            style={{ backgroundColor: getLineColor(lineId) }}
                          >
                            {lineId}
                          </div>
                        ))}
                      </div>
                      
                      {station.isInterchange && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Chuyển tuyến
                        </Badge>
                      )}
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {filteredStations.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy trạm</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có trạm nào khớp với tìm kiếm của bạn.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm trạm mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default StationsTab;
