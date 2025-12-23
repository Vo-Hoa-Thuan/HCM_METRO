import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Users, CalendarDays, CreditCard, QrCode, Train, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getTicketTypes, getTicketsByType, formatPrice } from '@/api/ticketsAPI';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ticketTypeLabels: Record<string, string> = {
  luot: "Vé Lượt",
  "khu hoi": "Vé Khứ Hồi",
  nhom: "Vé Nhóm",
  ngay: "Vé Ngày",
  tuan: "Vé Tuần",
  thang: "Vé Tháng",
};

const Tickets = () => {
  const [ticketTypes, setTicketTypes] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load Ticket Types
  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const data = await getTicketTypes();
        setTicketTypes(data || []);
        if (data.length > 0) {
          setSelectedTab(data[0]);
        }
      } catch (error) {
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách loại vé. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    };
    fetchTicketTypes();
  }, []);

  // Load Tickets by Type
  useEffect(() => {
    if (!selectedTab) return;
    const fetchTickets = async () => {
      try {
        setTickets([]);
        const data = await getTicketsByType(selectedTab);
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets", error);
      }
    };
    fetchTickets();
  }, [selectedTab]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) + delta, 1)
    }));
  };

  const handleBuyTicket = (ticketId: string) => {
    const quantity = quantities[ticketId] || 1;
    const isLoggedIn = localStorage.getItem("accessToken");

    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", JSON.stringify({
        path: "/payment",
        state: {
          ticketId,
          quantity,
          ticketName: tickets.find((t) => t._id === ticketId)?.name || "Vé Metro",
          ticketPrice: tickets.find((t) => t._id === ticketId)?.price || 0,
        },
      }));
      setIsLoginDialogOpen(true);
      return;
    }

    navigate("/payment", {
      state: {
        ticketId,
        quantity,
        ticketName: tickets.find(t => t._id === ticketId)?.name || "Vé Metro",
        ticketPrice: tickets.find(t => t._id === ticketId)?.price || 0,
      }
    });
  };

  const getTicketIcon = (type: string) => {
    switch (type) {
      case 'luot': return <CreditCard className="w-6 h-6" />;
      case 'ngay': return <CalendarDays className="w-6 h-6" />;
      case 'nhom': return <Users className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="px-4 py-1.5 text-blue-600 bg-blue-100 rounded-full mb-4">
            Mua vé trực tuyến
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Chọn loại vé phù hợp với bạn
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm hành trình di chuyển hiện đại, nhanh chóng và tiện lợi cùng Metro TP.HCM.
          </p>
        </div>

        {/* content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-white p-1.5 rounded-full shadow-md border border-gray-100">
              {ticketTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                >
                  {ticketTypeLabels[type] || type}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={selectedTab} className="space-y-8 animate-in fade-in-50 duration-500">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <Card key={ticket._id} className="group relative overflow-hidden border-2 border-transparent hover:border-blue-500/20 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <QrCode className="w-24 h-24" />
                  </div>

                  <CardHeader className="space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      {getTicketIcon(ticket.category)}
                    </div>
                    <CardTitle className="text-xl font-bold">{ticket.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{ticket.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-3xl font-extrabold text-blue-600">{formatPrice(ticket.price)}</span>
                      <span className="text-muted-foreground text-sm">/ vé</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md"
                        disabled={(quantities[ticket._id] || 1) <= 1}
                        onClick={() => updateQuantity(ticket._id, -1)}
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center font-semibold text-lg">{quantities[ticket._id] || 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md"
                        onClick={() => updateQuantity(ticket._id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button onClick={() => handleBuyTicket(ticket._id)} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-11 text-base">
                      <Wallet className="mr-2 h-4 w-4" />
                      Mua ngay
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Info Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-100 text-green-700 rounded-full">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Thanh toán an toàn</h3>
                <p className="text-sm text-gray-500">Hỗ trợ nhiều phương thức thanh toán bảo mật, tiện lợi.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Vé điện tử QR</h3>
                <p className="text-sm text-gray-500">Nhận vé QR ngay tức thì qua email và ứng dụng.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-orange-100 text-orange-700 rounded-full">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Hỗ trợ 24/7</h3>
                <p className="text-sm text-gray-500">Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đăng nhập để mua vé</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần đăng nhập tài khoản để thực hiện mua vé và quản lý lịch sử chuyến đi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Để sau</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setIsLoginDialogOpen(false); navigate('/login'); }}>
              Đăng nhập ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tickets;
