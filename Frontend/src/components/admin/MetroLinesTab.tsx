
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Edit, 
  Trash2, 
  Train, 
  Clock, 
  Plus, 
  MapPin, 
  Route, 
  Calendar,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import { metroLines, stations } from "@/utils/metroData";
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";

interface MetroLinesTabProps {
  searchTerm: string;
}

const MetroLinesTab = ({ searchTerm }: MetroLinesTabProps) => {
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  
  const filteredLines = metroLines.filter(
    (line) => 
      line.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle expanded line
  const toggleExpandLine = (lineId: string) => {
    if (expandedLine === lineId) {
      setExpandedLine(null);
    } else {
      setExpandedLine(lineId);
    }
  };

  // Get stations for a specific line
  const getStationsForLine = (lineId: string) => {
    return stations.filter(station => station.lines.includes(lineId));
  };

  return (
    <div className="space-y-4">
      {filteredLines.map((line, index) => (
        <motion.div
          key={line.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className={`hover-3d border-l-4`} style={{ borderLeftColor: line.color }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: line.color }}
                >
                  <Train className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-medium">
                    {line.nameVi}
                  </CardTitle>
                  <CardDescription>{line.name}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa tuyến metro</DialogTitle>
                      <DialogDescription>
                        Chỉnh sửa thông tin chi tiết cho tuyến {line.nameVi}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Edit form would go here */}
                      <div className="p-6 bg-accent/10 rounded-lg text-center">
                        <h3 className="font-medium mb-2">Form chỉnh sửa tuyến Metro</h3>
                        <p className="text-sm text-muted-foreground">
                          Chức năng đang trong quá trình phát triển.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleExpandLine(line.id)}
                  className={expandedLine === line.id ? "bg-accent/10" : ""}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedLine === line.id ? "transform rotate-180" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Giờ cao điểm</p>
                    <p className="text-xs text-muted-foreground">
                      {line.frequency.peakHours}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Giờ thường</p>
                    <p className="text-xs text-muted-foreground">
                      {line.frequency.offPeakHours}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Số trạm</p>
                    <p className="text-xs text-muted-foreground">
                      {line.stations.length} trạm
                    </p>
                  </div>
                </div>
              </div>
              
              {line.alerts && line.alerts.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Thông báo</h4>
                    <p className="text-xs text-yellow-700">
                      {line.alerts[0].message}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Expanded content */}
            {expandedLine === line.id && (
              <motion.div
                initial={{ opacity: 0, y: 0 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pt-2 pb-4"
              >
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Route className="h-4 w-4 mr-1" />
                    Các trạm trên tuyến
                  </h3>
                  
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-accent/20"></div>
                    <div className="space-y-3 pl-6">
                      {getStationsForLine(line.id).map((station, idx) => (
                        <div key={idx} className="flex items-center">
                          <div 
                            className="absolute left-2 w-2 h-2 rounded-full"
                            style={{ backgroundColor: line.color }}
                          ></div>
                          <div className="text-sm">{station.nameVi}</div>
                          {station.isInterchange && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Chuyển tuyến
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline">Xem chi tiết</Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <CardFooter className="px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Cập nhật gần đây: 12/06/2023
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleExpandLine(line.id)}>
                  {expandedLine === line.id ? "Thu gọn" : "Mở rộng"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
      
      {filteredLines.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Train className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy tuyến metro</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có tuyến metro nào khớp với tìm kiếm của bạn.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tuyến metro mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default MetroLinesTab;
