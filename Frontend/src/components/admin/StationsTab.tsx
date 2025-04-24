import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Edit, 
  Trash2, 
  MapPin, 
  Plus,
  Wifi,
  Ticket,
  ParkingSquare,
  Accessibility,
  Bath,
  ChevronDown,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/ui/motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Station, getAllStations, createStation, updateStation, deleteStation } from "@/api/stationsApi";
import StationForm from "./StationForm";
import { MetroLine, getAllLines } from "@/api/lineApi";


interface StationsTabProps {
  searchTerm: string;
}

const StationsTab = ({ searchTerm }: StationsTabProps) => {
  const [expandedStation, setExpandedStation] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameVi: '',
    coordinates: [106.629664, 10.823099], 
    address: '',
    lines: [], 
    facilities: [], 
    dailyPassengers: 0,
    isInterchange: false,
    isDepot: false,
    isUnderground: false,
    status: 'operational',
    hasWifi: false,
    hasParking: false,
    hasTicketMachine: false,
    hasAccessibility: false,
    hasBathroom: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: stationsData, 
    isLoading: isLoadingStations,
    error: stationsError 
  } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getAllStations()
  });

  const { 
    data: linesData 
  } = useQuery({
    queryKey: ['metroLines'],
    queryFn: () => getAllLines()
  });

  const createStationMutation = useMutation({
    mutationFn: createStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Tạo trạm mới thành công",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể tạo trạm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const updateStationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Station }) => updateStation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Cập nhật trạm thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật trạm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const deleteStationMutation = useMutation({
    mutationFn: deleteStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Xóa trạm thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể xóa trạm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const toggleExpandStation = (stationId: string) => {
    if (expandedStation === stationId) {
      setExpandedStation(null);
    } else {
      setExpandedStation(stationId);
    }
  };
  const filteredStations = stationsData?.filter(
    (station: Station) => 
      station.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, index] = name.split('.');
      const updatedArray = [...(formData[parent as keyof typeof formData] as Station[])];
      updatedArray[(index)] = value;
      setFormData({ ...formData, [parent]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleLineChange = (stationId: string) => {
    setFormData(prev => {
      const currentLines = [...prev.lines];
      if (currentLines.includes(stationId)) {
        return { ...prev, lines: currentLines.filter(id => id !== stationId) };
      } else {
        return { ...prev, lines: [...currentLines, stationId] };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameVi: '',
      coordinates: [106.629664, 10.823099], 
      address: '',
      lines: [], 
      facilities: ['ticket_machine'], 
      dailyPassengers: 0,
      isInterchange: false,
      isDepot: false,
      isUnderground: false,
      status: 'operational',
      hasWifi: false,
      hasParking: false,
      hasTicketMachine: true,
      hasAccessibility: true,
      hasBathroom: true,
    });
  };

  const handleEditClick = (station: Station) => {
    console.log("Trạm được chỉnh sửa:", station);
    setCurrentStation(station);
    setFormData({
      name: station.name,
      nameVi: station.nameVi,
      coordinates: [...station.coordinates], 
      address: station.address || '',
      lines:  Array.isArray(station.lines) ? [...station.lines] : [], 
      facilities: [...station.facilities], 
      dailyPassengers: station.dailyPassengers || 0,
      isInterchange: station.isInterchange,
      isDepot: station.isDepot,
      isUnderground: station.isUnderground,
      status: station.status,
      hasWifi: station.hasWifi,
      hasParking: station.hasParking,
      hasTicketMachine: station.hasTicketMachine,
      hasAccessibility: station.hasAccessibility,
      hasBathroom: station.hasBathroom,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (station: Station) => {
    console.log("Trạm xóa:", station);
    setCurrentStation(station);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const facilities = [];
    if (formData.hasWifi) facilities.push('wifi');
    if (formData.hasParking) facilities.push('parking');
    if (formData.hasTicketMachine) facilities.push('ticket_machine');
    if (formData.hasAccessibility) facilities.push('accessibility');
    if (formData.hasBathroom) facilities.push('bathroom');
    
    const stationData = {
      ...formData,
      };
    console.log("Dữ liệu gửi lên Backend:", stationData);
    createStationMutation.mutate(stationData as Station);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStation) {
      const facilities = [];
      if (formData.hasWifi) facilities.push('wifi');
      if (formData.hasParking) facilities.push('parking');
      if (formData.hasTicketMachine) facilities.push('ticket_machine');
      if (formData.hasAccessibility) facilities.push('accessibility');
      if (formData.hasBathroom) facilities.push('bathroom');
      
      const updatedData = {
        ...formData,
        facilities,
      };
      
      updateStationMutation.mutate({
        id: currentStation._id,
        data: updatedData as Station
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (currentStation) {
      deleteStationMutation.mutate(currentStation._id);
    }
  };

  if (isLoadingStations) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (stationsError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
        <p className="text-muted-foreground mt-1">
          {stationsError instanceof Error ? stationsError.message : 'Đã xảy ra lỗi khi tải dữ liệu trạm.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý trạm Metro</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm trạm mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm trạm mới</DialogTitle>
              <DialogDescription>
                Điền các thông tin dưới đây để tạo trạm metro mới.
              </DialogDescription>
            </DialogHeader>
            <StationForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleCheckboxChange={handleCheckboxChange}
              handleLineChange={handleLineChange}
              handleSubmit={handleCreateSubmit}
              availableLines={linesData || []}
              isSubmitting={createStationMutation.isPending}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Tạo trạm"
            />
            {/* Hiển thị dữ liệu formData */}
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h4 className="text-lg font-semibold mb-2">Dữ liệu nhập vào:</h4>
      <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStations.map((station: Station, index: number) => (
          <motion.div
            key={station._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{station.nameVi}</CardTitle>
                    <CardDescription>{station.name}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditClick(station)}>
                    
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteClick(station)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleExpandStation(station._id)}
                    className={expandedStation === station._id ? "bg-accent/10" : ""}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedStation === station._id ? "transform rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>
                      {station.coordinates[1].toFixed(3)}, {station.coordinates[0].toFixed(3)}
                    </span>
                  </div>
                  {station.isInterchange && (
                    <Badge variant="outline" className="text-xs">
                      Chuyển tuyến
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {linesData &&
                    (station.lines || []).map((_id: string) => {
                      const line = linesData.find((line: MetroLine) => line._id === _id);
                      return (
                        <Badge
                          key={_id}
                          style={{ backgroundColor: line?.color || "#999999", color: "#fff" }}
                          className="text-xs"
                        >
                          {line?.name || "Tuyến không xác định"}
                        </Badge>
                      );
                    })}
                </div>
              </CardContent>
              
              {expandedStation === station._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pt-2 pb-4"
                >
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="flex items-center text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${station.hasWifi ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          <Wifi className="h-3 w-3" />
                        </div>
                        <span>WiFi</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${station.hasParking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          <ParkingSquare className="h-3 w-3" />
                        </div>
                        <span>Bãi đỗ xe</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${station.hasTicketMachine ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          <Ticket className="h-3 w-3" />
                        </div>
                        <span>Máy bán vé</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${station.hasAccessibility ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          <Accessibility className="h-3 w-3" />
                        </div>
                        <span>Lối đi người khuyết tật</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${station.hasBathroom ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          <Bath className="h-3 w-3" />
                        </div>
                        <span>Nhà vệ sinh</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                          <span className="text-xs font-semibold">KH</span>
                        </div>
                        <span>{station.dailyPassengers.toLocaleString()} lượt/ngày</span>
                      </div>
                    </div>
                    
                    {station.address && (
                      <div className="mt-3 text-sm">
                        <p className="text-muted-foreground">Địa chỉ:</p>
                        <p>{station.address}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              <CardFooter className="px-6 py-3 text-xs text-muted-foreground">
                <div className="flex justify-between items-center w-full">
                <Badge 
                    className={`mt-1 text-white
                      ${station.status === 'operational' ? 'bg-active' : ''}
                      ${station.status === 'construction' ? 'bg-inactive' : ''}
                      ${station.status === 'planned' ? 'bg-success' : ''}
                      ${station.status === 'closed' ? 'bg-block' : ''}
                    `}
                  >
                    {station.status === 'operational' ? 'Đang hoạt động' : 
                     station.status === 'construction' ? 'Đang xây dựng' : 
                     station.status === 'planned' ? 'Đang lên kết hoạch' : 'Ngừng hoạt động'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => toggleExpandStation(station._id)}>
                    {expandedStation === station._id ? "Thu gọn" : "Chi tiết"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredStations.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy trạm nào</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có trạm nào khớp với tìm kiếm của bạn.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm trạm mới
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa trạm</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cho trạm {currentStation?.nameVi}.
            </DialogDescription>
          </DialogHeader>
          <StationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
            handleLineChange={handleLineChange}
            handleSubmit={handleEditSubmit}
            availableLines={linesData || []}
            isSubmitting={updateStationMutation.isPending}
            onCancel={() => {
              resetForm();
              setIsEditDialogOpen(false); 
            }}
            submitLabel="Cập nhật"
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Trạm "{currentStation?.nameVi}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteStationMutation.isPending && (
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

export default StationsTab;
