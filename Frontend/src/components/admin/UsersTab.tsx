import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Users, Plus, ChevronDown, AlertCircle, Loader2, Mail, Phone,
         User,Download, Settings, ShieldCheck, Calendar, MapPin, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/ui/motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, createUser, updateUser, deleteUser, exportUsers } from "@/api/userApi";
import UserForm from "./UserForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

interface UsersTabProps {
  searchTerm: string;
}

const timeOptions = [
  { label: "Hôm nay", value: "day" },
  { label: "Tuần này", value: "week" },
  { label: "Tháng này", value: "month" },
  { label: "Năm nay", value: "year" },
];

const UsersTab = ({ searchTerm }: UsersTabProps) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 'active',
  });
  
  const [selectedTab, setSelectedTab] = useState("all");
  const [useMockData, setUseMockData] = useState(false);
  const [selectedTime, setSelectedTime] = useState("month");
  const [userCount, setUserCount] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [usersData, setUsersData] = useState(null);
  const [isLoadingUsers, setIsLoading] = useState(true);
  const [usersError, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true); 
        const data = await getAllUsers();
        console.log("Dữ liệu nhận được từ API:", data);
        setUsersData(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); 


  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Tạo người dùng mới thành công",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể tạo người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Cập nhật người dùng thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể xóa người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  const exportUsersMutation = useMutation({
    mutationFn: exportUsers,
    onSuccess: (data) => {
      toast({
        title: "Xuất dữ liệu thành công",
        description: "File Excel đã được tạo và sẵn sàng để tải xuống",
      });
      
      console.log('Download URL:', data.downloadUrl);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể xuất dữ liệu người dùng: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });
  
  const userData = usersData || [];   
  console.log("Dữ liệu API nhận được:", usersData);
  console.log("Danh sách users:", usersData);

  
  const filteredUsers = userData.filter(
    (user: any) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (selectedTab === "all") return matchesSearch;
      if (selectedTab === "active") return matchesSearch && user.status === "active";
      if (selectedTab === "inactive") return matchesSearch && user.status === "inactive";
      if (selectedTab === "suspended") return matchesSearch && user.status === "suspended";
      if (selectedTab === "admin") return matchesSearch && user.role === "admin";
      if (selectedTab === "staff") return matchesSearch && user.role === "staff";
      if (selectedTab === "user") return matchesSearch && user.role === "user";
      
      return matchesSearch;
    }
  );

  const toggleExpandUser = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as unknown as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as unknown as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      phoneNumber: '',
      address: '',
      status: 'active',
    });
  };

  const handleEditClick = (user: any) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: any) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useMockData) {
      toast({
        title: "Thành công",
        description: "Tạo người dùng mới thành công (dữ liệu mẫu)",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } else {
      createUserMutation.mutate(formData as any);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      if (useMockData) {
        toast({
          title: "Thành công",
          description: "Cập nhật người dùng thành công (dữ liệu mẫu)",
        });
        setIsEditDialogOpen(false);
      } else {
        updateUserMutation.mutate({
          id: currentUser._id,
          data: formData
        });
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (currentUser) {
      if (useMockData) {
        toast({
          title: "Thành công",
          description: "Xóa người dùng thành công (dữ liệu mẫu)",
        });
        setIsDeleteDialogOpen(false);
      } else {
        deleteUserMutation.mutate(currentUser._id);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleExportData = () => {
    if (useMockData) {
      toast({
        title: "Xuất dữ liệu thành công",
        description: "File Excel đã được tạo và sẵn sàng để tải xuống (dữ liệu mẫu)",
      });
    } else {
      exportUsersMutation.mutate();
    }
  };

  const totalUsers = userData.length;
  const activeUsers = userData.filter((user: any) => user.status === "active").length;
  const adminCount = userData.filter((user: any) => user.role === "admin").length;
  const staffCount = userData.filter((user: any) => user.role === "staff").length;
  
  const activePercentage = Math.round((activeUsers / totalUsers) * 100) || 0;

  if (isLoadingUsers && !useMockData) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (usersError && !useMockData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
        <p className="text-muted-foreground mt-1">
          {usersError instanceof Error ? usersError.message : 'Đã xảy ra lỗi khi tải dữ liệu người dùng.'}
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setUseMockData(true)}
        >
          Sử dụng dữ liệu mẫu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogDescription>
                  Điền các thông tin dưới đây để tạo người dùng mới.
                </DialogDescription>
              </DialogHeader>
              <UserForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleSubmit={handleCreateSubmit}
                isSubmitting={createUserMutation.isPending}
                onCancel={() => setIsCreateDialogOpen(false)}
                submitLabel="Tạo người dùng"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalUsers}</div>
              <Users className="h-8 w-8  text-gray-700" />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span>Đang hoạt động</span>
                <span>{activePercentage}%</span>
              </div>
              <Progress value={activePercentage} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vai trò người dùng</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between space-x-4">
               <div className="space-y-2">
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-admin mr-2 rounded-full"></div>
                   <span className="text-sm text-admin">Quản trị viên ({adminCount})</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-staff mr-2 rounded-full"></div>
                   <span className="text-sm text-staff">Nhân viên ({staffCount})</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-3 h-3 bg-user mr-2 rounded-full"></div>
                   <span className="text-sm text-user">Người dùng ({totalUsers - adminCount - staffCount})</span>
                 </div>
               </div>
               <ShieldCheck className="h-8 w-8 text-gray-700" />
             </div>
           </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg p-4 border border-gray-200">
          <CardHeader className="pb-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CardTitle className="text-md font-semibold text-gray-700">Hoạt động gần đây</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-md px-3 py-1.5 text-gray-900 bg-gray-50 border border-gray-600 hover:bg-gray-700 transition">
                    {timeOptions.find(opt => opt.value === selectedTime)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-13 bg-white shadow-md rounded-md py-1 border border-gray-400">
                  {timeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSelectedTime(option.value)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Người dùng mới ({timeOptions.find(opt => opt.value === selectedTime)?.label})</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userCount}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-700" />
            </div>
            <p className="text-xs text-gray-500 mt-3">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-4">
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="all" className="flex-1">
            Tất cả ({userData.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            Đang hoạt động ({userData.filter((u: any) => u.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex-1">
            Không hoạt động ({userData.filter((u: any) => u.status === "inactive").length})
          </TabsTrigger>
          <TabsTrigger value="suspended" className="flex-1">
            Đã khóa ({userData.filter((u: any) => u.status === "suspended").length})
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex-1">
            Quản trị ({userData.filter((u: any) => u.role === "admin").length})
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex-1">
            Điều hành ({userData.filter((u: any) => u.role === "staff").length})
          </TabsTrigger>
          <TabsTrigger value="user" className="flex-1">
            Người dùng ({userData.filter((u: any) => u.role === "user").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user: any, index: number) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <Badge 
                      className={`mt-1 text-white 
                        ${user.role === 'admin' ? 'bg-admin' : ''} 
                        ${user.role === 'staff' ? 'bg-staff' : ''} 
                        ${user.role === 'user' ? 'bg-user' : ''}
                      `}
                    >
                      {user.role === 'admin' ? 'Quản trị viên' : 
                       user.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                    </Badge>                    
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditClick(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleExpandUser(user._id)}
                    className={expandedUser === user._id ? "bg-accent/10" : ""}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedUser === user._id ? "transform rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-col space-y-1.5">
                  {user.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 mr-2" />
                    <span>{user.email}</span>
                    </div>
                  )}
                                    
                  {user.phoneNumber && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 mr-2" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    <span>Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
              
              {expandedUser === user._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pt-2 pb-4"
                >
                  <div className="border-t pt-4">
                    {user.address ? (
                      <>
                        {user.address && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-muted-foreground">Địa chỉ:</p>
                            <div className="flex items-start mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 text-muted-foreground" />
                              <p className="text-sm">{user.address}</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">Không có thêm thông tin</p>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}
              
              <CardFooter className="px-6 py-3">
                <div className="flex justify-between items-center w-full">
                  <Badge 
                    className={`mt-1 text-white
                      ${user.status === 'active' ? 'bg-active' : ''}
                      ${user.status === 'inactive' ? 'bg-inactive' : ''}
                      ${user.status === 'suspended' ? 'bg-block' : ''}
                    `}
                  >
                    {user.status === 'active' ? 'Đang hoạt động' : 
                     user.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Hoạt động lần cuối: {user.lastActive ? new Date(user.lastActive).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy người dùng nào</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có người dùng nào khớp với tìm kiếm của bạn.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng mới
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cho người dùng {currentUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleEditSubmit}
            isSubmitting={false}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Cập nhật"
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Người dùng "{currentUser?.name}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersTab;
