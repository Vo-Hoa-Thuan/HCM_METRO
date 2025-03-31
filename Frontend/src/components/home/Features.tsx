
import { useInView } from '@/utils/animations';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  Bell, 
  Smartphone, 
  Star, 
  Ticket,
  QrCode,
  Route,
  Info,
  Check,
  X,
  Calendar,
  MessageCircle,
  Settings,
  LogIn,
  FileText,
  Headphones
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  details?: string[];
  path?: string;
  available?: boolean;
}

const Feature = ({ icon, title, description, delay, details = [], path, available = true }: FeatureProps) => {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(localStorage.getItem(`feature_${title}`) === 'active');

  useEffect(() => {
    // Load activation state from localStorage on component mount
    const savedState = localStorage.getItem(`feature_${title}`);
    if (savedState === 'active') {
      setIsActive(true);
    }
  }, [title]);

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!available) {
      toast({
        title: "Tính năng chưa khả dụng",
        description: "Tính năng này sẽ sớm được triển khai!",
        variant: "destructive"
      });
      return;
    }

    const newState = !isActive;
    setIsActive(newState);
    
    // Save activation state to localStorage
    localStorage.setItem(`feature_${title}`, newState ? 'active' : 'inactive');
    
    if (newState) {
      toast({
        title: `Đã kích hoạt ${title}`,
        description: "Tính năng đã được kích hoạt thành công",
      });
    } else {
      toast({
        title: `Đã vô hiệu hóa ${title}`,
        description: "Tính năng đã bị vô hiệu hóa",
        variant: "default"
      });
    }
  };

  const handleCardClick = () => {
    if (path && available) {
      navigate(path);
    } else if (!available) {
      toast({
        title: "Tính năng chưa khả dụng",
        description: "Tính năng này sẽ sớm được triển khai!",
        variant: "destructive"
      });
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`bg-white border border-border rounded-xl transition-all duration-500 ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } ${isActive ? 'ring-2 ring-accent' : ''} cursor-pointer hover:shadow-md`}
      style={{ transitionDelay: `${delay * 0.001}s` }}
      ref={ref}
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              available 
                ? 'bg-accent/10 text-accent' 
                : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            {icon}
          </div>
          <div className="flex items-center gap-2">
            {available ? (
              <Checkbox
                checked={isActive}
                onCheckedChange={() => handleActivate({ stopPropagation: () => {} } as React.MouseEvent)}
                aria-label={`Kích hoạt tính năng ${title}`}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Badge variant="outline" className="text-xs">Sắp ra mắt</Badge>
            )}
            {details.length > 0 && (
              <CollapsibleTrigger 
                className="rounded-full p-1 hover:bg-secondary"
                onClick={handleInfoClick}
              >
                <Info className="h-5 w-5 text-muted-foreground" />
              </CollapsibleTrigger>
            )}
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>

        {details.length > 0 && (
          <CollapsibleContent className="mt-4 pt-4 border-t border-border">
            <ul className="space-y-2">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-4 pt-1">
                    {available ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1"></div>
                    )}
                  </div>
                  <span className="text-sm">{detail}</span>
                </li>
              ))}
            </ul>
            {path && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }} 
                variant="ghost" 
                className="w-full mt-4"
                disabled={!available}
              >
                {available ? "Truy cập ngay" : "Sắp ra mắt"}
              </Button>
            )}
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};

const Features = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Bản đồ chi tiết",
      description: "Hiển thị bản đồ hệ thống metro với các tuyến đường cụ thể và thông tin nhà ga.",
      details: [
        "Hiển thị vị trí hiện tại của người dùng",
        "Thông tin chi tiết về các tiện ích tại mỗi nhà ga",
        "Xem thông tin về khoảng cách giữa các nhà ga"
      ],
      path: "/map",
      available: true
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Thời gian thực",
      description: "Tra cứu thông tin chuyến tàu theo thời gian thực và cập nhật tình trạng hoạt động.",
      details: [
        "Cập nhật liên tục thời gian đến của các chuyến tàu",
        "Thông báo về các sự cố và gián đoạn dịch vụ",
        "Hiển thị thời gian di chuyển dự kiến giữa các ga"
      ],
      path: "/realtime",
      available: true
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Đa nền tảng",
      description: "Hỗ trợ đa nền tảng: máy tính, điện thoại di động và các thiết bị khác.",
      details: [
        "Giao diện tối ưu cho điện thoại di động",
        "Ứng dụng web có thể cài đặt trên màn hình chính",
        "Đồng bộ hóa dữ liệu người dùng giữa các thiết bị"
      ],
      path: "/devices",
      available: true
    },
    {
      icon: <Route className="h-6 w-6" />,
      title: "Lộ trình tối ưu",
      description: "Đề xuất lộ trình tối ưu dựa trên vị trí hiện tại của người dùng và điểm đến.",
      details: [
        "Tính toán thời gian di chuyển ngắn nhất",
        "Đề xuất các tuyến thay thế khi có sự cố",
        "Tích hợp với các phương tiện khác để đề xuất lộ trình đa phương thức"
      ],
      path: "/routes",
      available: true
    },
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Quản lý vé",
      description: "Tạo tài khoản và quản lý vé điện tử, lịch sử mua vé và điểm thưởng.",
      details: [
        "Lưu trữ vé điện tử trong ứng dụng",
        "Kiểm tra lịch sử giao dịch vé",
        "Điểm thưởng tích lũy cho mỗi lần sử dụng dịch vụ"
      ],
      path: "/tickets",
      available: true
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Thanh toán QR",
      description: "Thanh toán nhanh chóng bằng QR code thông qua các ví điện tử phổ biến.",
      details: [
        "Tích hợp với MoMo, ZaloPay và VNPay",
        "Tạo QR code tự động cho mỗi giao dịch",
        "Xác nhận thanh toán tức thì"
      ],
      path: "/qr-payment",
      available: false
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Thanh toán đa dạng",
      description: "Tích hợp nhiều phương thức thanh toán: MoMo, ZaloPay, thẻ tín dụng và nhiều hơn nữa.",
      details: [
        "Hỗ trợ thẻ tín dụng/ghi nợ trong và ngoài nước",
        "Lưu thông tin thanh toán an toàn",
        "Ưu đãi khi sử dụng các phương thức thanh toán đối tác"
      ],
      path: "/payment",
      available: false
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Thông báo",
      description: "Nhận thông báo về các sự kiện, thay đổi lịch trình và ưu đãi đặc biệt.",
      details: [
        "Tùy chỉnh các loại thông báo muốn nhận",
        "Thông báo đẩy khi có sự cố hay thay đổi lịch trình",
        "Nhắc nhở về vé sắp hết hạn"
      ],
      path: "/notifications",
      available: false
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Đánh giá & phản hồi",
      description: "Đánh giá chất lượng dịch vụ của chuyến tàu hoặc nhà ga và gửi phản hồi.",
      details: [
        "Hệ thống đánh giá sao cho mỗi chuyến đi",
        "Gửi phản hồi chi tiết về trải nghiệm",
        "Xem đánh giá của người dùng khác"
      ],
      path: "/feedback",
      available: false
    },
    // Thêm các tính năng mới
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Lịch trình cá nhân",
      description: "Tạo và lưu lịch trình đi lại hàng ngày để nhận thông báo và gợi ý phù hợp.",
      details: [
        "Lập lịch trình đi lại thường xuyên",
        "Nhận thông báo trước chuyến đi",
        "Đồng bộ với Google Calendar hoặc Apple Calendar"
      ],
      path: "/schedule",
      available: true
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Trò chuyện hỗ trợ",
      description: "Trò chuyện trực tiếp với nhân viên hỗ trợ để được giải đáp thắc mắc ngay lập tức.",
      details: [
        "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp",
        "Chatbot tự động giải đáp các câu hỏi thường gặp",
        "Lưu lịch sử trò chuyện để tham khảo sau này"
      ],
      path: "/support",
      available: true
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Cài đặt cá nhân",
      description: "Tùy chỉnh ứng dụng theo sở thích cá nhân để có trải nghiệm tốt nhất.",
      details: [
        "Thay đổi ngôn ngữ và giao diện",
        "Cài đặt thông báo và quyền riêng tư",
        "Quản lý tài khoản và bảo mật"
      ],
      path: "/settings",
      available: true
    },
    {
      icon: <LogIn className="h-6 w-6" />,
      title: "Đăng nhập nhanh",
      description: "Đăng nhập nhanh chóng với tài khoản Google, Facebook hoặc đăng nhập sinh trắc học.",
      details: [
        "Đăng nhập một chạm với Google/Facebook",
        "Hỗ trợ đăng nhập bằng vân tay hoặc Face ID",
        "Xác thực hai yếu tố để tăng cường bảo mật"
      ],
      path: "/login",
      available: true
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Hướng dẫn sử dụng",
      description: "Hướng dẫn chi tiết về cách sử dụng hệ thống metro và các tính năng của ứng dụng.",
      details: [
        "Video hướng dẫn trực quan",
        "Hướng dẫn từng bước cho người mới",
        "Mẹo và thủ thuật cho người dùng thường xuyên"
      ],
      path: "/guides",
      available: true
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Hướng dẫn âm thanh",
      description: "Hệ thống hướng dẫn bằng âm thanh giúp người khiếm thị di chuyển dễ dàng hơn.",
      details: [
        "Hướng dẫn bằng giọng nói chi tiết",
        "Cảnh báo âm thanh khi đến ga",
        "Tương thích với trình đọc màn hình"
      ],
      path: "/audio-guide",
      available: false
    }
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
              details={feature.details}
              path={feature.path}
              available={feature.available}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
