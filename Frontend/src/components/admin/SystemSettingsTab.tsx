import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/ui/motion";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Save,
  Server,
  Database,
  GlobeLock,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ShieldCheck,
  BellRing,
  Lock,
  Palette,
  MonitorSmartphone,
  FileJson,
  RefreshCw,
  DownloadCloud,
  Clock,
  BookOpen
} from "lucide-react";

const SystemSettingsTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Cài đặt đã được lưu",
        description: "Các thay đổi cài đặt đã được áp dụng thành công.",
      });
    }, 1000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Cài đặt hệ thống</h2>
          <p className="text-muted-foreground mt-1">
            Quản lý cấu hình và tùy chỉnh hệ thống Metro HCM
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu cài đặt
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-100">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Lưu ý</AlertTitle>
        <AlertDescription className="text-blue-700">
          Các thay đổi cài đặt có thể ảnh hưởng đến toàn bộ hệ thống. Vui lòng kiểm tra kỹ trước khi lưu.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />
            <span>Chung</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="h-4 w-4 mr-2" />
            <span>Giao diện</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShieldCheck className="h-4 w-4 mr-2" />
            <span>Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BellRing className="h-4 w-4 mr-2" />
            <span>Thông báo</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Server className="h-4 w-4 mr-2" />
            <span>Bảo trì</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Cài đặt chung hệ thống
                </CardTitle>
                <CardDescription>
                  Cấu hình các thông tin cơ bản về hệ thống Metro HCM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">Tên hệ thống</Label>
                    <Input id="system-name" defaultValue="Metro HCM" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email quản trị viên</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="admin-email" defaultValue="admin@metrohcm.vn" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-description">Mô tả hệ thống</Label>
                  <Textarea 
                    id="system-description" 
                    className="min-h-[100px]"
                    defaultValue="Hệ thống quản lý Metro thành phố Hồ Chí Minh - Cung cấp dịch vụ vận chuyển công cộng hiện đại"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                      <div className="text-sm text-muted-foreground">
                        Khi bật, người dùng sẽ không thể truy cập hệ thống
                      </div>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="registration-enabled">Cho phép đăng ký</Label>
                      <div className="text-sm text-muted-foreground">
                        Cho phép người dùng mới đăng ký tài khoản
                      </div>
                    </div>
                    <Switch id="registration-enabled" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ticket-purchasing">Cho phép mua vé</Label>
                      <div className="text-sm text-muted-foreground">
                        Cho phép người dùng mua vé trực tuyến
                      </div>
                    </div>
                    <Switch id="ticket-purchasing" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Múi giờ và ngôn ngữ
                </CardTitle>
                <CardDescription>
                  Cấu hình múi giờ và ngôn ngữ mặc định cho hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Múi giờ mặc định</Label>
                    <Select defaultValue="Asia/Ho_Chi_Minh">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Chọn múi giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                        <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-language">Ngôn ngữ mặc định</Label>
                    <Select defaultValue="vi">
                      <SelectTrigger id="default-language">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Định dạng ngày tháng</Label>
                  <Select defaultValue="dd/MM/yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY (31/12/2023)</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (12/31/2023)</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (2023-12-31)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first-day">Ngày đầu tuần</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="first-day">
                      <SelectValue placeholder="Chọn ngày đầu tuần" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Thứ Hai</SelectItem>
                      <SelectItem value="0">Chủ Nhật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary" />
                  Tùy chỉnh giao diện
                </CardTitle>
                <CardDescription>
                  Tùy chỉnh giao diện người dùng của ứng dụng Metro HCM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Màu chính</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {['#0284c7', '#0891b2', '#0e7490', '#0f766e', '#047857', '#166534', '#4f46e5', '#6d28d9', '#9333ea'].map((color) => (
                      <div 
                        key={color}
                        className="h-8 cursor-pointer rounded-md border-2 border-transparent hover:border-black"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-mode">Chế độ chủ đề</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="bg-white border rounded-md p-2 w-full">
                        <div className="h-2 w-1/2 bg-black rounded-sm mb-1"></div>
                        <div className="h-2 w-full bg-gray-200 rounded-sm"></div>
                      </div>
                      <div>Sáng</div>
                    </Button>
                    
                    <Button variant="outline" className="justify-start h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="bg-gray-900 border border-gray-700 rounded-md p-2 w-full">
                        <div className="h-2 w-1/2 bg-white rounded-sm mb-1"></div>
                        <div className="h-2 w-full bg-gray-700 rounded-sm"></div>
                      </div>
                      <div>Tối</div>
                    </Button>
                    
                    <Button variant="outline" className="justify-start h-auto p-4 flex flex-col items-start space-y-2">
                      <div className="bg-gradient-to-r from-white to-gray-900 border rounded-md p-2 w-full">
                        <div className="h-2 w-1/2 bg-blue-500 rounded-sm mb-1"></div>
                        <div className="h-2 w-full bg-gray-400 rounded-sm"></div>
                      </div>
                      <div>Hệ thống</div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Kiểu phông chữ</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div>
                        <p className="font-sans text-lg mb-1">Sans Serif</p>
                        <p className="text-sm text-muted-foreground">Phông chữ không chân</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div>
                        <p className="font-serif text-lg mb-1">Serif</p>
                        <p className="text-sm text-muted-foreground">Phông chữ có chân</p>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border-radius">Bo tròn góc</Label>
                  <div className="pt-2">
                    <Slider defaultValue={[8]} max={20} step={1} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Góc vuông</span>
                    <span>Góc bo tròn</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo hệ thống</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-3xl font-bold text-primary">M</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Tải lên logo mới
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG hoặc SVG. Kích thước đề xuất 256x256px.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MonitorSmartphone className="h-5 w-5 mr-2 text-primary" />
                  Tùy chỉnh giao diện người dùng
                </CardTitle>
                <CardDescription>
                  Các thiết lập giao diện cho ứng dụng người dùng và quản trị viên
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hiển thị logo trên thanh điều hướng</Label>
                      <div className="text-sm text-muted-foreground">
                        Hiển thị logo trên thanh điều hướng của ứng dụng
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hiển thị thanh tìm kiếm</Label>
                      <div className="text-sm text-muted-foreground">
                        Hiển thị thanh tìm kiếm trên giao diện người dùng
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hiệu ứng chuyển động</Label>
                      <div className="text-sm text-muted-foreground">
                        Bật hiệu ứng chuyển động trong giao diện người dùng
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="menu-layout">Bố cục menu</Label>
                  <Select defaultValue="horizontal">
                    <SelectTrigger id="menu-layout">
                      <SelectValue placeholder="Chọn bố cục menu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Menu ngang (trên cùng)</SelectItem>
                      <SelectItem value="vertical">Menu dọc (bên trái)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="page-size">Kích thước phân trang</Label>
                  <Select defaultValue="10">
                    <SelectTrigger id="page-size">
                      <SelectValue placeholder="Chọn kích thước phân trang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 mục mỗi trang</SelectItem>
                      <SelectItem value="10">10 mục mỗi trang</SelectItem>
                      <SelectItem value="20">20 mục mỗi trang</SelectItem>
                      <SelectItem value="50">50 mục mỗi trang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                  Cài đặt bảo mật
                </CardTitle>
                <CardDescription>
                  Cấu hình các thiết lập bảo mật cho hệ thống Metro HCM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Chính sách mật khẩu</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Độ dài tối thiểu</Label>
                        <div className="text-sm text-muted-foreground">
                          Số ký tự tối thiểu cho mật khẩu
                        </div>
                      </div>
                      <Input type="number" className="w-20 text-right" defaultValue="8" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Yêu cầu chữ hoa</Label>
                        <div className="text-sm text-muted-foreground">
                          Yêu cầu ít nhất một ký tự in hoa
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Yêu cầu số</Label>
                        <div className="text-sm text-muted-foreground">
                          Yêu cầu ít nhất một ký tự số
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Yêu cầu ký tự đặc biệt</Label>
                        <div className="text-sm text-muted-foreground">
                          Yêu cầu ít nhất một ký tự đặc biệt
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Đăng nhập và xác thực</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Xác thực hai yếu tố</Label>
                        <div className="text-sm text-muted-foreground">
                          Yêu cầu xác thực hai yếu tố cho tất cả người dùng
                        </div>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Khóa tài khoản</Label>
                        <div className="text-sm text-muted-foreground">
                          Khóa tài khoản sau nhiều lần đăng nhập thất bại
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Số lần thử đăng nhập tối đa</Label>
                        <div className="text-sm text-muted-foreground">
                          Số lần thử đăng nhập thất bại trước khi khóa tài khoản
                        </div>
                      </div>
                      <Input type="number" className="w-20 text-right" defaultValue="5" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thời gian khóa tài khoản (phút)</Label>
                        <div className="text-sm text-muted-foreground">
                          Thời gian khóa tài khoản sau khi vượt quá số lần thử
                        </div>
                      </div>
                      <Input type="number" className="w-20 text-right" defaultValue="30" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Thời gian hết hạn phiên (phút)</Label>
                  <div className="pt-2">
                    <Slider defaultValue={[30]} min={5} max={60} step={5} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 phút</span>
                    <span>30 phút</span>
                    <span>60 phút</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GlobeLock className="h-5 w-5 mr-2 text-primary" />
                  CORS và bảo mật API
                </CardTitle>
                <CardDescription>
                  Cấu hình CORS và các thiết lập bảo mật API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="allowed-origins">Nguồn gốc được phép (CORS)</Label>
                  <Textarea 
                    id="allowed-origins" 
                    className="font-mono text-sm"
                    placeholder="https://example.com&#10;https://*.example.com"
                    defaultValue="http://localhost:3000&#10;https://metrohcm.vn"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mỗi nguồn gốc được phép trên một dòng
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bật rate limiting</Label>
                      <div className="text-sm text-muted-foreground">
                        Giới hạn số lượng yêu cầu API trong một khoảng thời gian
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số yêu cầu tối đa</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Khoảng thời gian (giây)</Label>
                      <Input type="number" defaultValue="60" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yêu cầu xác thực API</Label>
                      <div className="text-sm text-muted-foreground">
                        Yêu cầu xác thực cho tất cả các API endpoints
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-primary" />
                  Cấu hình thông báo
                </CardTitle>
                <CardDescription>
                  Cấu hình cài đặt cho email và thông báo trong ứng dụng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Cấu hình email</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Máy chủ SMTP</Label>
                        <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Cổng SMTP</Label>
                        <Input id="smtp-port" defaultValue="587" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">Tên người dùng SMTP</Label>
                        <Input id="smtp-user" defaultValue="notifications@metrohcm.vn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">Mật khẩu SMTP</Label>
                        <Input id="smtp-password" type="password" value="●●●●●●●●●●" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from-email">Email người gửi</Label>
                        <Input id="from-email" defaultValue="no-reply@metrohcm.vn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="from-name">Tên người gửi</Label>
                        <Input id="from-name" defaultValue="Metro HCM" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Bảo mật SSL/TLS</Label>
                        <div className="text-sm text-muted-foreground">
                          Sử dụng kết nối bảo mật cho email
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mẫu email</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4 text-left">
                      <div>
                        <p className="font-medium">Chào mừng người dùng mới</p>
                        <p className="text-sm text-muted-foreground mt-1">Email chào mừng người dùng mới</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4 text-left">
                      <div>
                        <p className="font-medium">Đặt lại mật khẩu</p>
                        <p className="text-sm text-muted-foreground mt-1">Email đặt lại mật khẩu</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4 text-left">
                      <div>
                        <p className="font-medium">Xác nhận đặt vé</p>
                        <p className="text-sm text-muted-foreground mt-1">Email xác nhận đặt vé</p>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4 text-left">
                      <div>
                        <p className="font-medium">Thông báo hệ thống</p>
                        <p className="text-sm text-muted-foreground mt-1">Email thông báo hệ thống</p>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thông báo trong ứng dụng</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo đẩy</Label>
                        <div className="text-sm text-muted-foreground">
                          Bật thông báo đẩy trong ứng dụng
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Âm thanh thông báo</Label>
                        <div className="text-sm text-muted-foreground">
                          Phát âm thanh khi có thông báo mới
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Thông báo trạng thái hệ thống</Label>
                        <div className="text-sm text-muted-foreground">
                          Hiển thị thông báo về trạng thái hệ thống
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Gửi email kiểm tra
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Cơ sở dữ liệu
                </CardTitle>
                <CardDescription>
                  Quản lý và bảo trì cơ sở dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Thông tin cơ sở dữ liệu</Label>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Loại:</p>
                        <p className="font-medium">MongoDB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phiên bản:</p>
                        <p className="font-medium">5.0.6</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kích thước:</p>
                        <p className="font-medium">245.8 MB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Số lượng collection:</p>
                        <p className="font-medium">12</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sao lưu</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tự động sao lưu</Label>
                        <div className="text-sm text-muted-foreground">
                          Tự động sao lưu cơ sở dữ liệu theo lịch
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Tần suất</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="backup-frequency">
                            <SelectValue placeholder="Chọn tần suất" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hàng giờ</SelectItem>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-time">Thời gian</Label>
                        <Select defaultValue="01:00">
                          <SelectTrigger id="backup-time">
                            <SelectValue placeholder="Chọn thời gian" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="00:00">00:00</SelectItem>
                            <SelectItem value="01:00">01:00</SelectItem>
                            <SelectItem value="02:00">02:00</SelectItem>
                            <SelectItem value="03:00">03:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-retention">Lưu giữ</Label>
                        <Select defaultValue="7">
                          <SelectTrigger id="backup-retention">
                            <SelectValue placeholder="Chọn thời gian lưu giữ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 ngày</SelectItem>
                            <SelectItem value="7">7 ngày</SelectItem>
                            <SelectItem value="14">14 ngày</SelectItem>
                            <SelectItem value="30">30 ngày</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Làm mới cơ sở dữ liệu
                  </Button>
                  <Button variant="outline">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Sao lưu thủ công
                  </Button>
                  <Button variant="outline">
                    <FileJson className="h-4 w-4 mr-2" />
                    Xuất cơ sở dữ liệu
                  </Button>
                </div>

                <div className="space-y-3">
                  <Alert variant="destructive" className="border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Cảnh báo</AlertTitle>
                    <AlertDescription>
                      Các hành động dưới đây có thể làm mất dữ liệu. Hãy chắc chắn bạn đã sao lưu trước khi thực hiện.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="destructive" size="sm">
                      Xóa dữ liệu bộ nhớ đệm
                    </Button>
                    <Button variant="destructive" size="sm">
                      Thiết lập lại cài đặt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-primary" />
                  Thông tin hệ thống
                </CardTitle>
                <CardDescription>
                  Thông tin về phiên bản và trạng thái hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phiên bản ứng dụng:</p>
                        <p className="font-medium">1.5.0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phiên bản Node.js:</p>
                        <p className="font-medium">18.16.0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Thời gian hoạt động:</p>
                        <p className="font-medium">15 ngày, 7 giờ, 23 phút</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bộ nhớ sử dụng:</p>
                        <p className="font-medium">512MB / 2GB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CPU:</p>
                        <p className="font-medium">12%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Đĩa:</p>
                        <p className="font-medium">14.2GB / 50GB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái dịch vụ</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                        <span>API</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Hoạt động
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                        <span>Cơ sở dữ liệu</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Hoạt động
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                        <span>Dịch vụ thông báo</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Hoạt động
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                        <span>Xác thực</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Hoạt động
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới thông tin
                </Button>
                <Button variant="default" className="w-full">
                  Xem nhật ký hệ thống
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default SystemSettingsTab;
