import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Users, CalendarDays, CreditCard, QrCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getTickets, getTicketTypes,  getTicketsByType, formatPrice} from '@/api/ticketsAPI'; 
import { DialogClose } from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';


const Tickets = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Lấy danh sách loại vé
  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const data = await getTicketTypes(); 
        console.log("Dữ liệu loại vé:", data);
  
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

  // Lấy vé theo loại
  useEffect(() => {
    if (!selectedTab) return; 

    const fetchTickets = async () => {
      try {
        setTickets([]); 
        const data = await getTicketsByType(selectedTab); 
        console.log(`Dữ liệu vé theo loại:${selectedTab} `, data);
        setTickets(data);
      } catch (error) {
        toast({
          title: "Lỗi tải dữ liệu",
          description: `Không thể tải danh sách vé loại ${selectedTab}. Vui lòng thử lại sau.`,
          variant: "destructive",
        });
      }
    };

    fetchTickets();
  }, [selectedTab]);

  // Tăng số lượng vé
  const increaseQuantity = (id) => {
    setQuantities((prev) => {
      const updatedQuantities = {
        ...prev,
        [id]: (prev[id] || 1) + 1,
      };
      console.log(`Tăng số lượng vé: ID = ${id}, Số lượng = ${updatedQuantities[id]}`);
      return updatedQuantities;
    });
  };  
  
  // Giảm số lượng vé
  const decreaseQuantity = (id) => {
    setQuantities((prev) => {
      const updatedQuantities = {
        ...prev,
        [id]: Math.max((prev[id] || 1) - 1, 1),
      };
      console.log(`Giảm số lượng vé: ID = ${id}, Số lượng = ${updatedQuantities[id]}`);
      return updatedQuantities;
    });
  };
  // Xử lý khi người dùng nhấn nút "Mua vé"
  // const handleBuyTicket = (ticketId) => {
  //   const quantity = quantities[ticketId] || 1; 
  //   const isLoggedIn = localStorage.getItem("accessToken")
  //   if (!isLoggedIn) {
  //     console.log("Người dùng chưa đăng nhập. Không thể mua vé.");
  //     toast({
  //       title: "Cảnh báo",
  //       description: "Bạn cần đăng nhập để mua vé."
  //     });
  //     return;
  //   }
  //   console.log(`Mua ${quantity} vé với ID: ${ticketId}`);
  // };

  const handleBuyTicket = (ticketId) => {
    const quantity = quantities[ticketId] || 1; 
    const isLoggedIn = localStorage.getItem("accessToken");
  
    if (!isLoggedIn) {
      console.log("Người dùng chưa đăng nhập. Hiển thị dialog."); 
      // Lưu thông tin trang đích vòa localStorage 
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          path: "/payment",
          state: {
            ticketId,
            quantity,
            ticketName: tickets.find((ticket) => ticket._id === ticketId)?.name || "Không xác định",
            ticketPrice: tickets.find((ticket) => ticket._id === ticketId)?.price || 0,
          },
        })
      );
      setIsLoginDialogOpen(true); 
      return;
    }
    
    // Nếu đã đăng nhập, chuyển hướng đến trang thanh toán
    navigate("/payment", {
      state: {
        ticketId, 
        quantity, 
        ticketName: tickets.find(ticket => ticket._id === ticketId)?.name || "Không xác định",
        ticketPrice: tickets.find(ticket => ticket._id === ticketId)?.price || 0,}
    }); 
  };

  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Đặt vé Metro TP.HCM</h1>
          <p className="text-muted-foreground">
            Chọn và mua vé cho chuyến đi của bạn trên hệ thống tàu điện metro TP.HCM.
          </p>
        </div>

        <Tabs value={selectedTab} className="max-w-4xl mx-auto" onValueChange={setSelectedTab}>
          <TabsList className="mb-3 flex overflow-x-auto space-x-4">
            {ticketTypes.length > 0 ? (
              ticketTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="px-4 py-1 text-center border rounded-lg whitespace-nowrap flex-shrink-0"
                >
                  {type}
                </TabsTrigger>
              ))
            ) : (
              <p>Không có loại vé nào để hiển thị.</p>
            )}
          </TabsList>

          <TabsContent value={selectedTab} className="grid md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="overflow-hidden">
                <CardHeader className="bg-accent/5 relative">
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>{ticket.description}</CardDescription>
                  <div className="absolute right-6 top-6 text-xl font-bold">{formatPrice(ticket.price)}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá vé:</span>
                      <span>{ticket.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Có hiệu lực:</span>
                      <span>{ticket.validity_unit || "Không xác định"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={(quantities[ticket._id] || 1) <= 1}
                      onClick={() => decreaseQuantity(ticket._id)}
                    >
                      -
                    </Button>
                    <span>{quantities[ticket._id] || 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => increaseQuantity(ticket._id)}
                    >
                      +
                    </Button>
                  </div>
                  <Button onClick={() => handleBuyTicket(ticket._id)} >
                    <Wallet className="mr-2 h-4 w-4" />
                    Mua vé
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>    
      <Footer />

      {/* Dialog yêu cầu đăng nhập */}
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yêu cầu đăng nhập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần đăng nhập để tiếp tục mua vé. Vui lòng đăng nhập để tiếp tục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsLoginDialogOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsLoginDialogOpen(false);
                navigate('/login');
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  );
};

export default Tickets;
