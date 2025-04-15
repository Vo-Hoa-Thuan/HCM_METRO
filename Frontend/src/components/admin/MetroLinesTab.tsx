
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetroLine, getAllLines, createLine, updateLine, deleteLine} from "@/api/lineApi";
import { Station, getAllStations} from "@/api/stationsApi";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MetroLinesTabProps {
  searchTerm: string;
}


const MetroLinesTab = ({ searchTerm }: MetroLinesTabProps) => {
  const [expandedLine, setExpandedLine] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState<MetroLine | null>(null);
  const [formData, setFormData] = useState<Partial<MetroLine>>({
    name: '',
    color: '#FF0000',
    stations: [],
    operatingHours: {
      weekday: '05:00 - 22:00',
      weekend: '06:00 - 22:00'
    },
    frequency: {
      peakHours: '5-7 phút',
      offPeakHours: '8-10 phút'
    },
    status: 'operational',
    length: 0,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch metro lines
  const { 
    data: linesData, 
    isLoading: isLoadingLines,
    error: linesError 
  } = useQuery({
    queryKey: ['metroLines'],
    queryFn: () => getAllLines()
  });

  useEffect(() => {
  console.log("linesData:", linesData);
}, [linesData]);


  // Fetch stations for select options
  const { 
    data: stationsData 
  } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getAllStations()
  });

  // Create metro line mutation
  const createLineMutation = useMutation({
    mutationFn: createLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metroLines'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Tạo tuyến metro mới thành công",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể tạo tuyến metro: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Update metro line mutation
  const updateLineMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MetroLine }) => updateLine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metroLines'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Cập nhật tuyến metro thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật tuyến metro: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Delete metro line mutation
  const deleteLineMutation = useMutation({
    mutationFn: deleteLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metroLines'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Xóa tuyến metro thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể xóa tuyến metro: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Filter lines based on search term
  // const filteredLines = linesData?.lines?.filter(
  //   (line: MetroLine) => 
  //     line.name.toLowerCase().includes(searchTerm.toLowerCase())
  // ) || [];
  const filteredLines = linesData || [];


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
    if (!stationsData) return [];
    return stationsData.filter((station: Station) => 
      station.lines.includes(lineId)
    );
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle multi-select for stations
  const handleStationsChange = (stationId: string) => {
    setFormData(prev => {
      const currentStations = prev.stations || [];
      if (currentStations.includes(stationId)) {
        return { ...prev, stations: currentStations.filter(id => id !== stationId) };
      } else {
        return { ...prev, stations: [...currentStations, stationId] };
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      color: '#FF0000',
      stations: [],
      operatingHours: {
        weekday: '05:00 - 22:00',
        weekend: '06:00 - 22:00'
      },
      frequency: {
        peakHours: '5-7 phút',
        offPeakHours: '8-10 phút'
      },
      status: 'operational',
      length: 0,
    });
  };

  // Handle edit line click
  const handleEditClick = (line: MetroLine) => {
    setCurrentLine(line);
    setFormData({
      name: line.name,
      color: line.color,
      stations: line.stations.map((station) => station.station), 
      operatingHours: { ...line.operatingHours },
      frequency: { ...line.frequency },
      status: line.status,
      length: line.length || 0,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete line click
  const handleDeleteClick = (line: MetroLine) => {
    setCurrentLine(line);
    setIsDeleteDialogOpen(true);
  };

  // Handle create form submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lineData = {
      ...formData
    };
    createLineMutation.mutate(lineData as MetroLine);
  };

  // Handle edit form submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentLine) {
      updateLineMutation.mutate({
        id: currentLine._id,
        data: formData as MetroLine
      });
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (currentLine) {
      deleteLineMutation.mutate(currentLine._id);
    }
  };

  if (isLoadingLines) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (linesError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
        <p className="text-muted-foreground mt-1">
          {linesError instanceof Error ? linesError.message : 'Đã xảy ra lỗi khi tải dữ liệu tuyến metro.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý tuyến Metro</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm tuyến mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm tuyến metro mới</DialogTitle>
              <DialogDescription>
                Điền các thông tin dưới đây để tạo tuyến metro mới.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên tuyến</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      placeholder="Tuyến số 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        value={formData.color || '#FF0000'}
                        onChange={handleInputChange}
                        className="w-12 h-9 p-1"
                      />
                      <Input
                        value={formData.color || '#FF0000'}
                        onChange={handleInputChange}
                        name="color"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Trạm trên tuyến</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {stationsData?.map((station: Station) => (
                      <div key={station._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-station-${station._id}`}
                          checked={(formData.stations || []).includes(station._id)} 
                          onChange={() => handleStationsChange(station._id)}
                          className="rounded"
                        />
                        <Label htmlFor={`edit-station-${station._id}`} className="text-sm cursor-pointer">
                          {station.nameVi}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operatingHours.weekday">Giờ hoạt động (thứ 2-6)</Label>
                    <Input
                      id="operatingHours.weekday"
                      name="operatingHours.weekday"
                      value={formData.operatingHours?.weekday || ''}
                      onChange={handleInputChange}
                      placeholder="05:00 - 22:00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingHours.weekend">Giờ hoạt động (cuối tuần)</Label>
                    <Input
                      id="operatingHours.weekend"
                      name="operatingHours.weekend"
                      value={formData.operatingHours?.weekend || ''}
                      onChange={handleInputChange}
                      placeholder="06:00 - 22:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency.peakHours">Tần suất giờ cao điểm</Label>
                    <Input
                      id="frequency.peakHours"
                      name="frequency.peakHours"
                      value={formData.frequency?.peakHours || ''}
                      onChange={handleInputChange}
                      placeholder="5-7 phút"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency.offPeakHours">Tần suất giờ thường</Label>
                    <Input
                      id="frequency.offPeakHours"
                      name="frequency.offPeakHours"
                      value={formData.frequency?.offPeakHours || ''}
                      onChange={handleInputChange}
                      placeholder="8-10 phút"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Đang hoạt động</SelectItem>
                        <SelectItem value="construction">Đang xây dựng</SelectItem>
                        <SelectItem value="planned">Đã lên kế hoạch</SelectItem>
                        <SelectItem value="closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Chiều dài (km)</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      value={formData.length || 0}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={createLineMutation.isPending}
                >
                  {createLineMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo tuyến
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredLines.map((line: MetroLine, index: number) => (
        <motion.div
          key={line._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className={`border-l-4`} style={{ borderLeftColor: line.color }}>
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
                    {line.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {line.status === "operational" ? "Đang hoạt động" : line.status}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEditClick(line)}>
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClick(line)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleExpandLine(line._id)}
                  className={expandedLine === line._id ? "bg-accent/10" : ""}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedLine === line._id ? "transform rotate-180" : ""}`} />
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
                      {line.frequency?.peakHours}
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
                      {line.frequency?.offPeakHours}
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
                      {line.stations?.length || 0} trạm
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
            {expandedLine === line._id && (
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
                      {getStationsForLine(line._id).map((station: Station, idx: number) => (
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
                      
                      {getStationsForLine(line._id).length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          Chưa có trạm nào trên tuyến này
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditClick(line)}
                    >
                      Chỉnh sửa tuyến
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <CardFooter className="px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleExpandLine(line._id)}>
                  {expandedLine === line._id ? "Thu gọn" : "Mở rộng"}
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
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm tuyến metro mới
          </Button>
        </div>
      )}

      {/* Edit Metro Line Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tuyến metro</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cho tuyến {currentLine?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tên tuyến</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Tuyến số 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Màu sắc</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-color"
                      name="color"
                      type="color"
                      value={formData.color || '#FF0000'}
                      onChange={handleInputChange}
                      className="w-12 h-9 p-1"
                    />
                    <Input
                      value={formData.color || '#FF0000'}
                      onChange={handleInputChange}
                      name="color"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Trạm trên tuyến</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {stationsData?.map((station: Station) => (
                    <div key={station._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-station-${station._id}`}
                        checked={(formData.stations || []).includes(station._id)}
                        onChange={() => handleStationsChange(station._id)}
                        className="rounded"
                      />
                      <Label htmlFor={`edit-station-${station._id}`} className="text-sm cursor-pointer">
                        {station.nameVi}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-operatingHours.weekday">Giờ hoạt động (thứ 2-6)</Label>
                  <Input
                    id="edit-operatingHours.weekday"
                    name="operatingHours.weekday"
                    value={formData.operatingHours?.weekday || ''}
                    onChange={handleInputChange}
                    placeholder="05:00 - 22:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-operatingHours.weekend">Giờ hoạt động (cuối tuần)</Label>
                  <Input
                    id="edit-operatingHours.weekend"
                    name="operatingHours.weekend"
                    value={formData.operatingHours?.weekend || ''}
                    onChange={handleInputChange}
                    placeholder="06:00 - 22:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency.peakHours">Tần suất giờ cao điểm</Label>
                  <Input
                    id="edit-frequency.peakHours"
                    name="frequency.peakHours"
                    value={formData.frequency?.peakHours || ''}
                    onChange={handleInputChange}
                    placeholder="5-7 phút"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency.offPeakHours">Tần suất giờ thường</Label>
                  <Input
                    id="edit-frequency.offPeakHours"
                    name="frequency.offPeakHours"
                    value={formData.frequency?.offPeakHours || ''}
                    onChange={handleInputChange}
                    placeholder="8-10 phút"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value )}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Đang hoạt động</SelectItem>
                      <SelectItem value="construction">Đang xây dựng</SelectItem>
                      <SelectItem value="planned">Đã lên kế hoạch</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-length">Chiều dài (km)</Label>
                  <Input
                    id="edit-length"
                    name="length"
                    type="number"
                    value={formData.length || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => 
                  {resetForm();
                  setIsEditDialogOpen(false)}}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={updateLineMutation.isPending}
              >
                {updateLineMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tuyến metro "{currentLine?.name}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteLineMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MetroLinesTab;
