
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Users, CalendarDays, CreditCard, QrCode } from 'lucide-react';
import { tickets, formatPrice } from '@/utils/metroData';
import { useToast } from "@/components/ui/use-toast";

const Tickets = () => {
  const [selectedTab, setSelectedTab] = useState('single');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleBuyTicket = (ticketId: string) => {
    setSelectedTicket(ticketId);
    toast({
      title: "Vé đã được thêm vào giỏ hàng",
      description: "Tiếp tục thanh toán để hoàn tất giao dịch.",
    });
  };

  const getTicketsByType = (type: string) => {
    return tickets.filter(ticket => ticket.type === type);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Đặt vé Metro TP.HCM
          </h1>
          <p className="text-muted-foreground">
            Chọn và mua vé cho chuyến đi của bạn trên hệ thống tàu điện metro TP.HCM.
          </p>
        </div>

        <Tabs defaultValue="single" className="max-w-4xl mx-auto" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="single" className="gap-2">
              <Wallet className="h-4 w-4" />
              Vé lẻ
            </TabsTrigger>
            <TabsTrigger value="period" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Vé thời gian
            </TabsTrigger>
            <TabsTrigger value="group" className="gap-2">
              <Users className="h-4 w-4" />
              Vé nhóm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="grid md:grid-cols-2 gap-6">
            {getTicketsByType('single').map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="bg-accent/5 relative">
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>{ticket.description}</CardDescription>
                  <div className="absolute right-6 top-6 text-xl font-bold">{formatPrice(ticket.price)}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá vé:</span>
                      <span>{formatPrice(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Có hiệu lực:</span>
                      <span>24 giờ kể từ khi kích hoạt</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                    >-</Button>
                    <span>{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</Button>
                  </div>
                  <Button onClick={() => handleBuyTicket(ticket.id)}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Mua vé
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {getTicketsByType('return').map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="bg-accent/5 relative">
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>{ticket.description}</CardDescription>
                  <div className="absolute right-6 top-6 text-xl font-bold">{formatPrice(ticket.price)}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá vé:</span>
                      <span>{formatPrice(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Có hiệu lực:</span>
                      <span>Trong ngày</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                    >-</Button>
                    <span>{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</Button>
                  </div>
                  <Button onClick={() => handleBuyTicket(ticket.id)}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Mua vé
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="period" className="grid md:grid-cols-2 gap-6">
            {getTicketsByType('day').concat(getTicketsByType('week'), getTicketsByType('month')).map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardHeader className="bg-accent/5 relative">
                  <CardTitle>{ticket.name}</CardTitle>
                  <CardDescription>{ticket.description}</CardDescription>
                  <div className="absolute right-6 top-6 text-xl font-bold">{formatPrice(ticket.price)}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá vé:</span>
                      <span>{formatPrice(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thời hạn:</span>
                      <span>{ticket.validityPeriod}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                    >-</Button>
                    <span>{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</Button>
                  </div>
                  <Button onClick={() => handleBuyTicket(ticket.id)}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Mua vé
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="group" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Vé nhóm - Tiết kiệm 15%</CardTitle>
                <CardDescription>Dành cho nhóm từ 5 người trở lên. Áp dụng cho tất cả các tuyến.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá vé cơ bản:</span>
                    <span>{formatPrice(15000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span className="text-green-600">-15%</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Giá mỗi vé:</span>
                    <span>{formatPrice(15000 * 0.85)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số lượng tối thiểu:</span>
                    <span>5 người</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={quantity < 5}
                    onClick={() => setQuantity(Math.max(5, quantity - 1))}
                  >-</Button>
                  <span>{Math.max(5, quantity)}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >+</Button>
                </div>
                <Button onClick={() => handleBuyTicket('group-ticket')}>
                  <Users className="mr-2 h-4 w-4" />
                  Đặt vé nhóm
                </Button>
              </CardFooter>
            </Card>

            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Thẻ tín dụng</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                  <QrCode className="h-6 w-6" />
                  <span>MoMo</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                  <QrCode className="h-6 w-6" />
                  <span>ZaloPay</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                  <Wallet className="h-6 w-6" />
                  <span>Tiền mặt</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;
