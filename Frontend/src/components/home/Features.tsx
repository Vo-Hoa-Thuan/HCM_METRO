
import { useInView } from '@/utils/animations';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell, 
  Smartphone, 
  Star, 
  Ticket,
  QrCode
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`bg-white border border-border rounded-xl p-6 transition-all duration-500 ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay * 0.1}s` }}
    >
      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Bản đồ chi tiết",
      description: "Hiển thị bản đồ hệ thống metro với các tuyến đường cụ thể và thông tin nhà ga."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Thời gian thực",
      description: "Tra cứu thông tin chuyến tàu theo thời gian thực và cập nhật tình trạng hoạt động."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Đa nền tảng",
      description: "Hỗ trợ đa nền tảng: máy tính, điện thoại di động và các thiết bị khác."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Lộ trình tối ưu",
      description: "Đề xuất lộ trình tối ưu dựa trên vị trí hiện tại của người dùng và điểm đến."
    },
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Quản lý vé",
      description: "Tạo tài khoản và quản lý vé điện tử, lịch sử mua vé và điểm thưởng."
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Thanh toán QR",
      description: "Thanh toán nhanh chóng bằng QR code thông qua các ví điện tử phổ biến."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Thanh toán đa dạng",
      description: "Tích hợp nhiều phương thức thanh toán: MoMo, ZaloPay, thẻ tín dụng và nhiều hơn nữa."
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Thông báo",
      description: "Nhận thông báo về các sự kiện, thay đổi lịch trình và ưu đãi đặc biệt."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Đánh giá & phản hồi",
      description: "Đánh giá chất lượng dịch vụ của chuyến tàu hoặc nhà ga và gửi phản hồi."
    },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Tính năng
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trải nghiệm di chuyển metro <span className="text-accent">thông minh</span>
          </h2>
          <p className="text-muted-foreground">
            Metro Pathfinder cung cấp đầy đủ các tính năng cần thiết để chuyến đi của bạn trở nên thuận tiện và dễ dàng hơn bao giờ hết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
