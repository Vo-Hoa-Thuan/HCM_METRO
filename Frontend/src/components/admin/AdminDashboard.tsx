import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Train, TicketCheck, Clock, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion } from "@/components/ui/motion";
import { metroLines, stations, tickets } from "@/utils/metroData";

const AdminDashboard = () => {
  const statsData = [
    {
      title: "Tổng số người dùng",
      value: "12,486",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-50",
      link: "/admin/users"
    },
    {
      title: "Tổng số tuyến Metro",
      value: metroLines.length.toString(),
      change: "+1",
      trend: "up",
      icon: <Train className="h-5 w-5 text-green-500" />,
      bgColor: "bg-green-50",
      link: "/admin/lines"
    },
    {
      title: "Tổng số trạm",
      value: stations.length.toString(),
      change: "+3",
      trend: "up",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      bgColor: "bg-purple-50",
      link: "/admin/stations"
    },
    {
      title: "Vé đã bán hôm nay",
      value: "1,247",
      change: "-4%",
      trend: "down",
      icon: <TicketCheck className="h-5 w-5 text-orange-500" />,
      bgColor: "bg-orange-50",
      link: "/admin/tickets"
    }
  ];

  // Sample data for charts
  const chartData = {
    weeklyPassengers: [2400, 3200, 2900, 3100, 3500, 4100, 3800],
    weekDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    busyHours: [
      { time: "06:00", value: 65 },
      { time: "08:00", value: 90 },
      { time: "10:00", value: 40 },
      { time: "12:00", value: 55 },
      { time: "14:00", value: 45 },
      { time: "16:00", value: 70 },
      { time: "18:00", value: 95 },
      { time: "20:00", value: 60 },
      { time: "22:00", value: 35 }
    ],
    revenueByLine: metroLines.map(line => ({
      name: line.id,
      value: Math.floor(Math.random() * 50) + 20,
      color: line.color
    }))
  };

  const recentActivities = [
    {
      action: "Thêm trạm mới",
      description: "Trạm Thủ Đức đã được thêm vào tuyến số 1",
      time: "10 phút trước",
      user: "Nguyễn Văn A"
    },
    {
      action: "Cập nhật giá vé",
      description: "Giá vé tháng đã được điều chỉnh",
      time: "1 giờ trước",
      user: "Trần Thị B"
    },
    {
      action: "Bảo trì hệ thống",
      description: "Lịch bảo trì tuyến số 2 đã được cập nhật",
      time: "3 giờ trước",
      user: "Phạm Văn C"
    }
  ];

  const today = new Date();
  const dayOfWeek = today.getDay();
  const maxPassengersToday = 15000 + Math.floor(Math.random() * 2000);
  const currentPassengers = Math.floor(maxPassengersToday * (today.getHours() / 24) * (0.7 + Math.random() * 0.3));
  const percentageOfMax = Math.floor((currentPassengers / maxPassengersToday) * 100);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover-3d">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <CardDescription>7 ngày qua</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} so với tuần trước
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Main Chart */}
        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="hover-3d">
            <CardHeader>
              <CardTitle>Lượng hành khách trong tuần</CardTitle>
              <CardDescription>Số lượt đi metro theo ngày trong tuần</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {chartData.weeklyPassengers.map((value, index) => (
                    <div key={index} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className="bg-accent hover:bg-accent/80 rounded-t transition-all"
                        style={{
                          height: `${(value / Math.max(...chartData.weeklyPassengers)) * 100}%`
                        }}
                      ></div>
                      <span className="mt-2 text-center text-xs text-muted-foreground">
                        {chartData.weekDays[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover-3d h-full">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các thay đổi và cập nhật hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start pb-4 last:pb-0 last:border-0 border-b">
                    <div className="mr-4 p-2 rounded-full bg-muted">
                      <Activity className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Bởi: {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Xem tất cả hoạt động
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Passengers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="hover-3d">
            <CardHeader>
              <CardTitle>Lượng khách hiện tại</CardTitle>
              <CardDescription>Ước tính lượng người đang sử dụng metro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">
                  {currentPassengers.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">0</span>
                  <span className="text-muted-foreground">{maxPassengersToday.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent"
                    style={{ width: `${percentageOfMax}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {percentageOfMax}% công suất tối đa
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Busy Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover-3d">
            <CardHeader>
              <CardTitle>Giờ cao điểm</CardTitle>
              <CardDescription>Lưu lượng khách theo giờ hôm nay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full">
                <div className="flex h-full items-end gap-1">
                  {chartData.busyHours.map((hour, index) => (
                    <div key={index} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className={`rounded-t transition-all ${hour.value > 80 ? "bg-red-400" : hour.value > 60 ? "bg-orange-400" : "bg-green-400"}`}
                        style={{
                          height: `${hour.value}%`
                        }}
                      ></div>
                      <span className="mt-1 text-center text-[10px] text-muted-foreground">
                        {hour.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue by Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="hover-3d">
            <CardHeader>
              <CardTitle>Doanh thu theo tuyến</CardTitle>
              <CardDescription>Phân bổ doanh thu theo tuyến metro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.revenueByLine.map((line, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: line.color }}
                        ></div>
                        <span>Tuyến {line.name}</span>
                      </div>
                      <span>{line.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full"
                        style={{ width: `${line.value}%`, backgroundColor: line.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;