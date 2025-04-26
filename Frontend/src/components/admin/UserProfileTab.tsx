import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById, updateUser, changePassword} from "@/api/userApi";
import { Switch } from "@/components/ui/switch";
import { motion } from "@/components/ui/motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar, 
  AlertTriangle,
  Lock,
  UserCog,
  Bell,
  Languages,
  Monitor,
  Save,
  UploadCloud,
  Key,
  Globe,
  LogOut,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Status = "active" | "inactive" | "suspended";

const UserProfileTab = () => {
  const { user, updateUserInfo } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    role: "",
    joinDate: "",
    status: 'active' as Status,
  });
  console.log("User context:", user); 

useEffect(() => {
  if (!user?.id) return;

  const fetchUser = async () => {
    try {
      const data = await getUserById(user.id);
      console.log("✅ Dữ liệu người dùng từ API:", data);

      setProfileData({
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
        address: data.address,
        avatar: data.avatar || "https://github.com/shadcn.png",
        role: data.role,
        status: data.status,
        joinDate: data.createdAt
          ? new Date(data.createdAt).toLocaleString("vi-VN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Không rõ",
      });
    } catch (error) {
      console.error("❌ Lỗi khi fetch user:", error);
    }
  };

  fetchUser();
}, [user?.id]);


  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      await updateUser(user.id, {
        name: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar,
        status: profileData.status,
      });
  
      // ✅ Cập nhật lại context
      updateUserInfo({
        name: profileData.name,
        id: user.id,
        role: user.role,
        status: user.status
      });
 
      localStorage.setItem("name", profileData.name);
      localStorage.setItem("email", profileData.email);
      localStorage.setItem("phoneNumber", profileData.phone);
      localStorage.setItem("address", profileData.address);
      localStorage.setItem("avatar", profileData.avatar);
  
      setProfileData((prevUser) => ({
        ...prevUser,
        name: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar,
      }));
  
      toast({
        title: "Đã lưu thành công",
        description: "Thông tin hồ sơ của bạn đã được cập nhật",
        duration: 3000,
        className: "bg-success text-white",
      });
    } catch (error: any) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: error.message || "Đã có lỗi xảy ra",
      });
    }
  };
  
  
  const handleSaveSettings = () => {
    toast({
      title: "Đã lưu thành công",
      description: "Cài đặt của bạn đã được cập nhật",
      duration: 3000,
    });
  };
  
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mật khẩu không khớp",
        description: "Mật khẩu mới và xác nhận mật khẩu không giống nhau",
      });
      return;
    }
  
    try {
      await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);

  
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
  
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật",
        duration: 3000,
        className: "bg-success text-white",
      });
    } catch (error: any) {
      console.error("❌ Lỗi đổi mật khẩu:", error);
      toast({
        variant: "destructive",
        title: "Đổi mật khẩu thất bại",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
      });
    }
  };
  
  
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={profileData.avatar} alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-muted-foreground">{profileData.email}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 mr-1" /> {profileData.role}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Calendar className="h-3 w-3 mr-1" /> Tham gia: {profileData.joinDate}
                  </Badge>
                  <Badge 
                    className={`mt-1 text-white
                      ${profileData.status === 'active' ? 'bg-active' : ''}
                      ${profileData.status=== 'inactive' ? 'bg-inactive' : ''}
                      ${profileData.status=== 'suspended' ? 'bg-block' : ''}
                    `}
                  >
                    {profileData.status === 'active' ? 'Đang hoạt động' : 
                     profileData.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Button 
                  variant={isEditing ? "outline" : "default"} 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa hồ sơ"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Hồ sơ</span>
              <span className="inline sm:hidden">Hồ sơ</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Bảo mật</span>
              <span className="inline sm:hidden">Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Tùy chọn</span>
              <span className="inline sm:hidden">Tùy chọn</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Phiên</span>
              <span className="inline sm:hidden">Phiên</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {isEditing && (
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thông tin
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name ?? ""}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email ?? ""}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone ?? ""}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="role"
                        value={profileData.role ?? ""}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      name="address"
                      value={profileData.address ?? ""}
                      onChange={handleInputChange}
                      className="min-h-[80px] pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Ảnh đại diện</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Kéo thả file hoặc click để tải lên
                      </p>
                      <Button variant="outline" size="sm">
                        Chọn hình ảnh
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG hoặc GIF. Tối đa 2MB.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 caret-black cursor-text"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                        }
                      />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Mật khẩu mới</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 caret-black cursor-text"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                          }
                        />
                         <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 caret-black cursor-text"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                          }
                        />
                         <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-blue-50 p-4 flex items-start space-x-3 border border-blue-100">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-medium text-blue-900">Lưu ý về bảo mật</h4>
                      <p className="text-blue-700 mt-1">
                        Mật khẩu của bạn phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, 
                        số và ký tự đặc biệt để tăng cường bảo mật.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      Cập nhật mật khẩu
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Xác thực hai yếu tố</CardTitle>
                <CardDescription>
                  Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Xác thực qua SMS</div>
                    <div className="text-sm text-muted-foreground">
                      Sử dụng số điện thoại của bạn để xác thực
                    </div>
                  </div>
                  <Button variant="outline">Thiết lập</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Ứng dụng xác thực</div>
                    <div className="text-sm text-muted-foreground">
                      Sử dụng ứng dụng như Google Authenticator
                    </div>
                  </div>
                  <Button variant="outline">Thiết lập</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Khóa bảo mật USB</div>
                    <div className="text-sm text-muted-foreground">
                      Sử dụng khóa bảo mật vật lý như YubiKey
                    </div>
                  </div>
                  <Button variant="outline">Thiết lập</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Tùy chỉnh giao diện</CardTitle>
                    <CardDescription>
                      Điều chỉnh giao diện người dùng theo sở thích của bạn
                    </CardDescription>
                  </div>
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Chủ đề</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          <span>Sáng</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          <span>Tối</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          <span>Theo hệ thống</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">
                        <div className="flex items-center">
                          <Languages className="h-4 w-4 mr-2" />
                          <span>Tiếng Việt</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center">
                          <Languages className="h-4 w-4 mr-2" />
                          <span>English</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-sm font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Thông báo
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_notifications">Thông báo qua email</Label>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo qua email về các sự kiện quan trọng
                        </p>
                      </div>
                      <Switch 
                        id="email_notifications" 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app_notifications">Thông báo trong ứng dụng</Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị thông báo trong ứng dụng
                        </p>
                      </div>
                      <Switch 
                        id="app_notifications" 
                        checked={appNotifications} 
                        onCheckedChange={setAppNotifications} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Bố cục</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start text-left p-4 h-24">
                      <div>
                        <div className="font-medium mb-1">Cổ điển</div>
                        <div className="text-xs text-muted-foreground">
                          Menu ở trên đầu
                        </div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="justify-start text-left p-4 h-24">
                      <div>
                        <div className="font-medium mb-1">Thanh bên</div>
                        <div className="text-xs text-muted-foreground">
                          Menu ở bên trái
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Phiên đăng nhập hoạt động</CardTitle>
                <CardDescription>
                  Quản lý các phiên đăng nhập hiện tại của bạn trên các thiết bị
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start space-x-4">
                  <div>
                    <Monitor className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Máy tính hiện tại</p>
                        <p className="text-sm text-muted-foreground">Windows 10 · Chrome 98.0</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                        Hiện tại
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Hồ Chí Minh, Việt Nam · Hoạt động gần đây: Vừa xong</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 flex items-start space-x-4">
                  <div>
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">MacBook Pro</p>
                        <p className="text-sm text-muted-foreground">macOS · Safari</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Đăng xuất
                      </Button>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Hà Nội, Việt Nam · Hoạt động gần đây: 2 ngày trước</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 flex items-start space-x-4">
                  <div>
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">iPhone 12</p>
                        <p className="text-sm text-muted-foreground">iOS · Safari Mobile</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Đăng xuất
                      </Button>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Đà Nẵng, Việt Nam · Hoạt động gần đây: 1 tuần trước</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất khỏi tất cả thiết bị khác
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UserProfileTab;
function setUser(arg0: (prevUser: any) => any) {
  throw new Error("Function not implemented.");
}

