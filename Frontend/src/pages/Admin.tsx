
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetroLinesTab from "@/components/admin/MetroLinesTab";
import StationsTab from "@/components/admin/StationsTab";
import TicketsTab from "@/components/admin/TicketsTab";
import UsersTab from "@/components/admin/UsersTab";
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
  ChevronDown
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


const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Kiểm tra nếu user chưa đăng nhập
  useEffect(() => {
    console.log("🔍 isAuthenticated trong Admin:", user?.isAuthenticated);
    if (!user?.isAuthenticated) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Nếu chưa đăng nhập, không render Admin
  if (!user?.isAuthenticated) {
    return null;
  }

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
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </Button>
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
                        <span className="text-xs text-muted-foreground">Admin</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
          >
            <TabsList className="bg-muted/50 p-1 shadow-sm">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="lines" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Tuyến Metro
              </TabsTrigger>
              <TabsTrigger value="stations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Trạm
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Vé
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Người dùng
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {activeTab !== "dashboard" && (
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
