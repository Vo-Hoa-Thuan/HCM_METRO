
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  HelpCircle, 
  Clock, 
  TicketCheck, 
  MessageSquare, 
  FileText, 
  X, 
  ChevronDown,
  ChevronRight,
  Home
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from '@/components/ui/motion';

// Define message type
type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'seen' | 'error';
  attachments?: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
};

type SupportTicket = {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  lastUpdated?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
};

const suggestedQuestions = [
  "Làm thế nào để đặt mua vé Metro?",
  "Các tuyến Metro hiện tại và lịch trình",
  "Chính sách hoàn trả vé Metro",
  "Làm thế nào để tìm đường đến ga Metro gần nhất?",
  "Thủ tục đổi vé khi bị mất"
];

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Làm thế nào để đặt mua vé Metro?",
    answer: "Bạn có thể mua vé Metro thông qua ứng dụng Metro hcm, tại các quầy vé ở ga hoặc qua website chính thức. Chúng tôi cung cấp nhiều loại vé khác nhau: vé một chiều, vé khứ hồi, vé ngày và vé tháng. Thanh toán có thể thực hiện bằng tiền mặt, thẻ ngân hàng hoặc ví điện tử như MoMo, ZaloPay.",
    category: "Vé"
  },
  {
    id: "2",
    question: "Các tuyến Metro hiện tại và lịch trình",
    answer: "Hiện tại TP HCM có 6 tuyến Metro từ số 1 đến số 6, mỗi tuyến có màu riêng. Tất cả các tuyến đều hoạt động từ 5:30 - 22:30 trong tuần và 6:00 - 22:00 vào cuối tuần. Tần suất chạy tàu vào giờ cao điểm là 5-8 phút tùy tuyến và 10-15 phút vào giờ thường.",
    category: "Lịch trình"
  },
  {
    id: "3",
    question: "Chính sách hoàn trả vé Metro",
    answer: "Vé một chiều không được hoàn trả. Vé tháng có thể hoàn trả trong vòng 7 ngày kể từ ngày mua với phí hủy 10%. Để hoàn trả, hãy mang vé và chứng minh nhân dân đến quầy dịch vụ khách hàng tại các ga chính hoặc gửi yêu cầu qua ứng dụng Metro hcm.",
    category: "Vé"
  },
  {
    id: "4",
    question: "Làm thế nào để tìm đường đến ga Metro gần nhất?",
    answer: "Bạn có thể sử dụng tính năng 'Tìm ga gần nhất' trong ứng dụng Metro hcm. Ứng dụng sẽ sử dụng vị trí hiện tại của bạn để chỉ đường đến ga Metro gần nhất. Ngoài ra, bạn cũng có thể tham khảo bản đồ Metro trong phần 'Bản đồ' của ứng dụng hoặc website.",
    category: "Điều hướng"
  },
  {
    id: "5",
    question: "Thủ tục đổi vé khi bị mất",
    answer: "Nếu bạn đã đăng ký tài khoản và mua vé qua ứng dụng Metro hcm, bạn có thể báo mất và yêu cầu cấp lại vé trong ứng dụng. Nếu mua vé giấy, bạn cần đến quầy dịch vụ khách hàng cùng với giấy tờ tùy thân và hóa đơn mua vé (nếu có) để được hỗ trợ. Lưu ý rằng có thể có phí cấp lại vé.",
    category: "Vé"
  },
  {
    id: "6",
    question: "Có dịch vụ wifi miễn phí trên tàu Metro không?",
    answer: "Tất cả các đoàn tàu Metro và nhà ga đều có wifi miễn phí. Để kết nối, hãy chọn mạng 'Metro-Free-WiFi' và đăng nhập bằng số điện thoại hoặc tài khoản Metro hcm. Tốc độ wifi đủ để duyệt web, kiểm tra email và nhắn tin, nhưng có thể không phù hợp cho việc xem video chất lượng cao.",
    category: "Tiện ích"
  },
  {
    id: "7",
    question: "Làm thế nào để báo cáo đồ thất lạc?",
    answer: "Nếu bạn đánh mất đồ trên tàu Metro hoặc tại nhà ga, hãy báo cáo ngay cho nhân viên nhà ga hoặc gọi đến tổng đài 1900xxxx. Bạn cũng có thể báo cáo qua ứng dụng Metro hcm trong phần 'Đồ thất lạc'. Cung cấp mô tả chi tiết về vật phẩm, thời gian và địa điểm bạn nghĩ mình đã đánh mất nó.",
    category: "Dịch vụ"
  },
  {
    id: "8",
    question: "Metro có tiện ích gì cho người khuyết tật?",
    answer: "Tất cả các nhà ga Metro đều được thiết kế thân thiện với người khuyết tật, bao gồm thang máy, đường dốc, nhà vệ sinh đặc biệt và khu vực chờ ưu tiên. Các đoàn tàu có khu vực dành riêng cho xe lăn và hệ thống thông báo bằng âm thanh và hình ảnh. Nhân viên tại các nhà ga cũng được đào tạo để hỗ trợ người khuyết tật khi cần.",
    category: "Tiện ích"
  },
  {
    id: "9",
    question: "Làm thế nào để đăng ký thẻ Metro thường xuyên?",
    answer: "Thẻ Metro thường xuyên (Regular Commuter Card) là lựa chọn tiết kiệm cho người dùng thường xuyên. Để đăng ký, hãy mang theo CMND/CCCD đến quầy dịch vụ khách hàng tại các ga chính hoặc đăng ký online qua ứng dụng Metro hcm. Thẻ có phí phát hành 50,000 VND và có thể nạp tiền với số tiền tối thiểu là 100,000 VND.",
    category: "Vé"
  },
  {
    id: "10",
    question: "Quy định về hành lý trên tàu Metro?",
    answer: "Hành khách được phép mang theo hành lý cá nhân với kích thước không quá 60x40x30cm và trọng lượng không quá 20kg. Không được mang theo vật dễ cháy nổ, chất độc hại, vũ khí hoặc động vật (trừ động vật hỗ trợ cho người khuyết tật). Xe đạp gấp được phép mang lên tàu ngoài giờ cao điểm nếu được bọc trong túi chuyên dụng.",
    category: "Quy định"
  },
];

const tickets: SupportTicket[] = [
  {
    id: "T-001",
    subject: "Không thể thanh toán vé bằng ZaloPay",
    status: "in-progress",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    priority: "medium",
    category: "Thanh toán"
  },
  {
    id: "T-002",
    subject: "Thời gian chờ tàu quá lâu tại ga Bến Thành",
    status: "open",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    priority: "low",
    category: "Dịch vụ"
  },
  {
    id: "T-003",
    subject: "Yêu cầu hoàn tiền vé tháng do chuyển công tác",
    status: "resolved",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: "high",
    category: "Hoàn tiền"
  }
];

// Bot responses based on keywords
const botResponses: { [key: string]: string } = {
  "vé": "Bạn có thể mua vé Metro tại quầy vé ở các nhà ga, qua ứng dụng Metro hcm hoặc website chính thức. Chúng tôi có nhiều loại vé: vé một chiều (từ 15,000đ), vé khứ hồi (25,000đ), vé ngày (50,000đ) và vé tháng (750,000đ).",
  "tuyến": "Hiện tại TP HCM có 6 tuyến Metro: Tuyến 1 (Đỏ): Bến Thành - Suối Tiên, Tuyến 2 (Xanh): Thủ Thiêm - Củ Chi, Tuyến 3 (Xanh lá): Bến Thành - Bình Tân, Tuyến 4 (Tím): Lăng Cha Cả - Cảng Hiệp Phước, Tuyến 5 (Vàng): BX Cần Giuộc - Cầu Sài Gòn, Tuyến 6 (Nâu): Ba Quẹo - Vòng xoay Phú Lâm.",
  "giờ": "Các tuyến Metro đều hoạt động từ 5:30 - 22:30 trong tuần và 6:00 - 22:00 vào cuối tuần. Tần suất chạy tàu vào giờ cao điểm là 5-8 phút tùy tuyến và 10-15 phút vào giờ thường.",
  "hoàn": "Chính sách hoàn vé: Vé một chiều không được hoàn tiền. Vé tháng có thể hoàn trả trong vòng 7 ngày kể từ ngày mua với phí hủy 10%. Mang vé và CMND đến quầy dịch vụ tại các ga chính hoặc yêu cầu qua ứng dụng.",
  "mất": "Nếu mất vé điện tử, bạn có thể báo mất và yêu cầu cấp lại trong ứng dụng. Với vé giấy, hãy đến quầy dịch vụ với CMND và hóa đơn (nếu có) để được hỗ trợ. Có thể có phí cấp lại vé.",
  "wifi": "Tất cả tàu Metro và nhà ga đều có wifi miễn phí. Kết nối với mạng 'Metro-Free-WiFi' và đăng nhập bằng số điện thoại hoặc tài khoản Metro hcm.",
  "thất lạc": "Nếu bạn đánh mất đồ, hãy báo ngay cho nhân viên ga, gọi 1900xxxx hoặc báo qua ứng dụng (phần 'Đồ thất lạc'). Cung cấp mô tả chi tiết, thời gian và địa điểm bạn nghĩ đã mất đồ.",
  "khuyết tật": "Các nhà ga có thang máy, đường dốc, nhà vệ sinh đặc biệt và khu vực chờ ưu tiên. Tàu có khu vực riêng cho xe lăn và hệ thống thông báo bằng âm thanh/hình ảnh. Nhân viên sẵn sàng hỗ trợ khi cần.",
  "thẻ": "Thẻ Metro thường xuyên có phí phát hành 50,000đ và nạp tối thiểu 100,000đ. Đăng ký tại quầy dịch vụ (mang CMND) hoặc qua ứng dụng Metro hcm.",
  "hành lý": "Hành lý cá nhân không quá 60x40x30cm và 20kg. Không mang vật dễ cháy nổ, chất độc, vũ khí hoặc động vật (trừ động vật hỗ trợ). Xe đạp gấp được phép ngoài giờ cao điểm nếu có túi chuyên dụng.",
  "giá": "Giá vé Metro phụ thuộc vào loại vé và quãng đường: Vé một chiều từ 15,000đ-30,000đ, vé khứ hồi 25,000đ-50,000đ, vé ngày 50,000đ, vé tuần 200,000đ, vé tháng từ 750,000đ.",
  "trễ": "Nếu tàu bị trễ hơn 15 phút, bạn có thể yêu cầu hoàn tiền cho vé một chiều hoặc được cộng thêm 1 chuyến vào vé tuần/tháng. Báo cáo sự cố tại quầy dịch vụ hoặc qua ứng dụng.",
  "an toàn": "Hệ thống Metro được trang bị camera an ninh, nhân viên an ninh, hệ thống báo cháy và thiết bị cứu hộ. Các hướng dẫn an toàn được niêm yết tại mỗi toa tàu và nhà ga.",
  "trẻ em": "Trẻ em dưới 6 tuổi và chiều cao dưới 120cm được miễn phí khi đi cùng người lớn có vé. Mỗi người lớn chỉ được đi kèm tối đa 2 trẻ em miễn phí.",
  "chó": "Động vật cưng không được phép lên tàu, trừ động vật hỗ trợ cho người khuyết tật (có giấy chứng nhận). Động vật hỗ trợ phải đeo rọ mõm và dây xích.",
  "xe đạp": "Xe đạp gấp được phép mang lên tàu ngoài giờ cao điểm (9:00-16:00 và sau 19:00) nếu được bọc trong túi chuyên dụng. Xe đạp thường không được phép.",
  "khẩn cấp": "Trong trường hợp khẩn cấp, hãy giữ bình tĩnh và làm theo hướng dẫn của nhân viên. Mỗi toa tàu và nhà ga đều có nút báo động khẩn cấp, bình cứu hỏa và thiết bị sơ cứu.",
  "bản đồ": "Bạn có thể xem bản đồ chi tiết hệ thống Metro trong phần 'Bản đồ' của ứng dụng Metro hcm hoặc website chính thức. Bản đồ cũng được hiển thị tại tất cả các nhà ga.",
  "default": "Cảm ơn bạn đã liên hệ với chúng tôi. Vui lòng cho biết thêm chi tiết về câu hỏi của bạn để chúng tôi có thể hỗ trợ tốt hơn."
};

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 9);

const Support = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: generateId(),
      text: "Xin chào! Tôi là trợ lý ảo Metro hcm. Tôi có thể giúp gì cho bạn hôm nay?",
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'Vé'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Use a smooth scroll for better user experience
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;
    
    // Create a new user message
    const newUserMessage: MessageType = {
      id: generateId(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setAttachments([]);
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.trim());
      
      // Fix type error by ensuring the status is one of the allowed values
      const updatedMessages = prev => [
        ...prev.map(msg => 
          msg.id === newUserMessage.id 
            ? { ...msg, status: 'seen' as const } 
            : msg
        ),
        botResponse
      ];
      
      setMessages(updatedMessages);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): MessageType => {
    // Find matching keywords in the user input
    const userInputLower = userInput.toLowerCase();
    let responseText = botResponses.default;
    
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (userInputLower.includes(keyword.toLowerCase())) {
        responseText = response;
        break;
      }
    }
    
    return {
      id: generateId(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent'
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newAttachments: string[] = [];
    
    Array.from(files).forEach(file => {
      // In a real app, you would upload the file to a server
      // For demo, we'll just use the file name
      newAttachments.push(file.name);
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
    // Use a slight delay to ensure the UI updates before sending
    setTimeout(() => {
      handleSendMessage();
    }, 50);
  };

  const handleFaqToggle = (id: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs 
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng nhập đầy đủ tiêu đề và mô tả",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Yêu cầu đã được gửi",
      description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất",
    });
    
    setNewTicket({
      subject: '',
      description: '',
      category: 'Vé'
    });
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isLiked: isPositive ? true : msg.isLiked,
          isDisliked: !isPositive ? true : msg.isDisliked
        };
      }
      return msg;
    }));
    
    toast({
      title: "Cảm ơn phản hồi của bạn",
      description: isPositive 
        ? "Chúng tôi rất vui khi câu trả lời đã giúp ích cho bạn" 
        : "Chúng tôi sẽ cải thiện câu trả lời này",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Trợ giúp & Hỗ trợ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hệ thống trợ giúp tự động hoặc kết nối với nhân viên hỗ trợ để giải đáp mọi thắc mắc về dịch vụ Metro TP.HCM
            </p>
          </div>

          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Trò chuyện</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Câu hỏi thường gặp</span>
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <TicketCheck className="h-4 w-4" />
                <span>Yêu cầu hỗ trợ</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="bg-white rounded-lg shadow-md border p-4">
              <motion.div 
                className="flex h-[600px] flex-col rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex gap-3 max-w-[80%]">
                        {message.sender === 'bot' && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src="/logo.png" alt="Metro Bot" />
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className="flex flex-col">
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`rounded-lg p-3 ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground ml-auto' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((file, index) => (
                                  <div key={index} className="text-xs bg-black/10 rounded px-2 py-1 flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    <span className="truncate">{file}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                          
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <span>
                              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            
                            {message.sender === 'user' && message.status && (
                              <span className="ml-2">
                                {message.status === 'sending' && 'Đang gửi...'}
                                {message.status === 'sent' && 'Đã gửi'}
                                {message.status === 'seen' && 'Đã xem'}
                                {message.status === 'error' && 'Lỗi'}
                              </span>
                            )}
                            
                            {message.sender === 'bot' && (
                              <div className="ml-2 flex items-center gap-1">
                                <button 
                                  onClick={() => handleFeedback(message.id, true)}
                                  className={`p-1 rounded-full hover:bg-accent/10 ${message.isLiked ? 'text-green-500' : ''}`}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={() => handleFeedback(message.id, false)}
                                  className={`p-1 rounded-full hover:bg-accent/10 ${message.isDisliked ? 'text-red-500' : ''}`}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {message.sender === 'user' && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src="/logo.png" alt="Metro Bot" />
                          <AvatarFallback>
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-muted rounded-lg p-3"
                        >
                          <div className="flex gap-1">
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="mt-4">
                  <div className="p-2 bg-accent/5 rounded-lg mb-2">
                    <p className="text-xs text-muted-foreground mb-2">Câu hỏi gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                          className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full hover:bg-accent/20 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          <span className="max-w-[100px] truncate">{file}</span>
                          <button 
                            onClick={() => removeAttachment(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="icon"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="h-4 w-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn của bạn..."
                        className="min-h-[40px] max-h-[120px] resize-none"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() && attachments.length === 0}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="faq" className="bg-white rounded-lg shadow-md border p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center p-6">
                    <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-muted-foreground">Không tìm thấy câu hỏi nào phù hợp</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <motion.div 
                      key={faq.id} 
                      className="border rounded-lg overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-muted/50"
                        onClick={() => handleFaqToggle(faq.id)}
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFaqs[faq.id] ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      
                      {expandedFaqs[faq.id] && (
                        <motion.div 
                          className="p-4 pt-0"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <Separator className="my-3" />
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="mt-3 flex justify-between items-center">
                            <Badge variant="outline">{faq.category}</Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Câu trả lời có hữu ích không?</span>
                              <button className="p-1 rounded-full hover:bg-accent/10 hover:text-accent">
                                <ThumbsUp className="h-3 w-3" />
                              </button>
                              <button className="p-1 rounded-full hover:bg-accent/10 hover:text-accent">
                                <ThumbsDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tickets" className="bg-white rounded-lg shadow-md border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Gửi yêu cầu hỗ trợ mới</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Tiêu đề
                      </label>
                      <Input
                        id="subject"
                        placeholder="Nhập tiêu đề yêu cầu"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Danh mục
                      </label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      >
                        <option value="Vé">Vé</option>
                        <option value="Lịch trình">Lịch trình</option>
                        <option value="Thanh toán">Thanh toán</option>
                        <option value="Dịch vụ">Dịch vụ</option>
                        <option value="Hoàn tiền">Hoàn tiền</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Mô tả chi tiết
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                        rows={5}
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="attachments" className="block text-sm font-medium mb-1">
                        Đính kèm (tùy chọn)
                      </label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="w-full">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Chọn tệp đính kèm
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="button" className="w-full" onClick={handleCreateTicket}>
                      Gửi yêu cầu
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Yêu cầu hỗ trợ của bạn</h3>
                  
                  {tickets.length === 0 ? (
                    <div className="text-center p-6 border rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <p className="text-muted-foreground">Bạn chưa có yêu cầu hỗ trợ nào</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <motion.div 
                          key={ticket.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="hover:shadow-md transition-shadow duration-300" is3d>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{ticket.subject}</CardTitle>
                                <Badge
                                  variant={
                                    ticket.status === 'open' ? 'default' :
                                    ticket.status === 'in-progress' ? 'secondary' :
                                    ticket.status === 'resolved' ? 'outline' : 'outline'
                                  }
                                >
                                  {ticket.status === 'open' && 'Mở'}
                                  {ticket.status === 'in-progress' && 'Đang xử lý'}
                                  {ticket.status === 'resolved' && 'Đã giải quyết'}
                                  {ticket.status === 'closed' && 'Đã đóng'}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {ticket.createdAt.toLocaleDateString('vi-VN')}
                                </span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Mã yêu cầu: {ticket.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {ticket.category}
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm" className="w-full text-xs">
                                Xem chi tiết
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
