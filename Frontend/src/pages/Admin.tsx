
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetroLinesTab from "@/components/admin/MetroLinesTab";
import StationsTab from "@/components/admin/StationsTab";
import TicketsTab from "@/components/admin/TicketsTab";
import UsersTab from "@/components/admin/UsersTab";
import UserProfileTab from "@/components/admin/UserProfileTab";
import SystemSettingsTab from "@/components/admin/SystemSettingsTab";
import FeedbackTab from "@/components/admin/FeedbackTab";
import AdminDashboard from "@/components/admin/AdminDashboard";
import SearchBar from "@/components/admin/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Home, 
  LineChart, 
  TrendingUp, 
  Bell,
  User,
  Settings,
  ChevronDown,
  Users,
  Ticket,
  Train,
  MapPin,
  UserCog,
  Cog,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, don't render the admin page
  if (!isAuthenticated) {
    return null;
  }

  // Function to clear notifications
  const clearNotifications = () => {
    setUnreadNotifications(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 to-white">
      {/* Admin Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold ml-2">Metro Admin</h1>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Thông báo</span>
                      {unreadNotifications > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearNotifications}>
                          Đánh dấu tất cả đã đọc
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {unreadNotifications > 0 ? (
                      <>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Cập nhật hệ thống</span>
                              <span className="text-xs text-muted-foreground">5 phút trước</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Phiên bản 1.5.0 đã sẵn sàng để cài đặt
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Người dùng mới</span>
                              <span className="text-xs text-muted-foreground">1 giờ trước</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Có 5 người dùng mới đăng ký trong hôm nay
                            </span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-3 cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Cảnh báo bảo mật</span>
                              <span className="text-xs text-muted-foreground">1 ngày trước</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Phát hiện đăng nhập lạ từ thiết bị mới
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Không có thông báo mới
                      </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-2 text-center cursor-pointer">
                      Xem tất cả thông báo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              <Link to="/">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Trang chủ</span>
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur border shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chào mừng quay trở lại, {user?.name}!</h2>
                  <p className="text-muted-foreground">
                    Hôm nay là ngày {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Hệ thống hoạt động tốt</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-auto"
          >
            <TabsList className="bg-muted/50 p-1 shadow-sm">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Tổng quan</span>
              </TabsTrigger>
              <TabsTrigger value="lines" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Train className="h-4 w-4" />
                <span>Tuyến Metro</span>
              </TabsTrigger>
              <TabsTrigger value="stations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Trạm</span>
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span>Vé</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Người dùng</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Phản hồi</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span>Hồ sơ</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                <Cog className="h-4 w-4" />
                <span>Cài đặt</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {activeTab !== "dashboard" && activeTab !== "profile" && activeTab !== "settings" && activeTab !== "feedback" && (
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}

          <TabsContent value="dashboard" className="space-y-4">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="lines" className="bg-transparent">
            <MetroLinesTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="stations" className="bg-transparent">
            <StationsTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="tickets" className="bg-transparent">
            <TicketsTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="users" className="bg-transparent">
            <UsersTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="feedback" className="bg-transparent">
            <FeedbackTab />
          </TabsContent>

          <TabsContent value="profile" className="bg-transparent">
            <UserProfileTab />
          </TabsContent>

          <TabsContent value="settings" className="bg-transparent">
            <SystemSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
};

export default Admin;
