
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Smartphone, Laptop, Tablet, Watch } from 'lucide-react';

const DeviceCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-border">
      <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Devices = () => {
  const devices = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Điện thoại di động",
      description: "Ứng dụng được tối ưu hoàn hảo cho tất cả các điện thoại Android và iOS, với trải nghiệm người dùng mượt mà."
    },
    {
      icon: <Tablet className="h-6 w-6" />,
      title: "Máy tính bảng",
      description: "Giao diện rộng hơn giúp hiển thị nhiều thông tin hơn và tương tác thuận tiện trên màn hình lớn."
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "Máy tính",
      description: "Trải nghiệm đầy đủ với tất cả tính năng nâng cao và bố cục tối ưu cho màn hình lớn."
    },
    {
      icon: <Watch className="h-6 w-6" />,
      title: "Đồng hồ thông minh",
      description: "Thông báo và cập nhật trạng thái tàu ngay trên cổ tay, không cần lấy điện thoại ra."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Hỗ trợ đa nền tảng</h1>
          <p className="text-muted-foreground">
            Metro Pathfinder hoạt động mượt mà trên tất cả các thiết bị, đảm bảo bạn luôn 
            được kết nối dù đang sử dụng thiết bị nào.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {devices.map((device, index) => (
            <DeviceCard
              key={index}
              icon={device.icon}
              title={device.title}
              description={device.description}
            />
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-4">Đồng bộ hóa liền mạch</h2>
          <p className="mb-4">
            Tất cả dữ liệu của bạn, bao gồm lịch sử tìm kiếm, lộ trình đã lưu và cài đặt cá nhân, 
            sẽ được đồng bộ hóa tự động giữa các thiết bị khi bạn đăng nhập vào tài khoản của mình.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-medium mb-2">Đăng nhập một lần</h3>
              <p className="text-sm text-muted-foreground">Đăng nhập một lần và truy cập trên mọi thiết bị</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-medium mb-2">Đồng bộ tức thì</h3>
              <p className="text-sm text-muted-foreground">Thay đổi được cập nhật ngay lập tức trên tất cả các thiết bị</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="font-medium mb-2">Lịch sử di chuyển</h3>
              <p className="text-sm text-muted-foreground">Lịch sử tìm kiếm và lộ trình được lưu trữ an toàn</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Devices;
