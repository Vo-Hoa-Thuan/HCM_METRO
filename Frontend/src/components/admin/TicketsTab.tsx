
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  TicketCheck, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Plus,
  BarChart3,
  Calendar,
  CalendarDays,
  Tag,
  Star
} from "lucide-react";
import { tickets } from "@/utils/metroData";
import { motion } from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";

interface TicketsTabProps {
  searchTerm: string;
}

const TicketsTab = ({ searchTerm }: TicketsTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Calculate all unique categories
  const categories = Array.from(new Set(tickets.map(ticket => ticket.type)));
  
  // Filter tickets based on search term and selected category
  const filteredTickets = tickets.filter(
    (ticket) => (
      (ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === null || ticket.type === selectedCategory)
    )
  );

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(price);
  };

  // Get badge styles for ticket type
  const getTicketTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "single":
        return "bg-blue-100 text-blue-800";
      case "day":
        return "bg-green-100 text-green-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      case "student":
        return "bg-amber-100 text-amber-800";
      case "senior":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get icon for ticket type
  const getTicketTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "single":
        return <TicketCheck className="h-4 w-4" />;
      case "day":
        return <Calendar className="h-4 w-4" />;
      case "monthly":
        return <CalendarDays className="h-4 w-4" />;
      case "student":
        return <Star className="h-4 w-4" />;
      case "senior":
        return <Star className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCategory === null ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Tất cả
        </Button>
        
        {categories.map((category) => (
          <Button 
            key={category}
            variant={selectedCategory === category ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="flex items-center gap-1"
          >
            {getTicketTypeIcon(category)}
            {category === "single" ? "Vé lượt" : 
             category === "day" ? "Vé ngày" :
             category === "monthly" ? "Vé tháng" :
             category === "student" ? "Vé sinh viên" :
             category === "senior" ? "Vé người cao tuổi" : category}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="hover-3d border-t-4 border-t-accent">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge 
                      className={`mb-2 ${getTicketTypeBadge(ticket.type)}`} 
                      variant="secondary"
                    >
                      {getTicketTypeIcon(ticket.type)}
                      <span className="ml-1">
                        {ticket.type === "single" ? "Vé lượt" : 
                         ticket.type === "day" ? "Vé ngày" :
                         ticket.type === "monthly" ? "Vé tháng" :
                         ticket.type === "student" ? "Vé sinh viên" :
                         ticket.type === "senior" ? "Vé người cao tuổi" : ticket.type}
                      </span>
                    </Badge>
                    <CardTitle className="text-lg font-medium">
                      {ticket.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ticket.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">
                    {formatPrice(ticket.price)}
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {ticket.validityPeriod}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Đã bán hôm nay</div>
                    <div className="font-medium">{Math.floor(Math.random() * 400) + 50}</div>
                    <div className="flex items-center justify-center mt-1">
                      {Math.random() > 0.5 ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+{Math.floor(Math.random() * 15) + 2}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-xs">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span>-{Math.floor(Math.random() * 10) + 1}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Doanh thu</div>
                    <div className="font-medium">{formatPrice(ticket.price * (Math.floor(Math.random() * 400) + 50))}</div>
                    <div className="flex items-center justify-center mt-1">
                      {Math.random() > 0.5 ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+{Math.floor(Math.random() * 15) + 2}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-xs">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span>-{Math.floor(Math.random() * 10) + 1}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {ticket.restrictions && (
                  <div className="text-xs text-muted-foreground mt-3">
                    <span className="font-medium">Hạn chế:</span> {ticket.restrictions}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span>Xu hướng: {Math.random() > 0.6 ? "Tăng" : "Ổn định"}</span>
                </div>
                <Button size="sm" variant="outline">
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {/* Add New Ticket Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: filteredTickets.length * 0.05 }}
        >
          <Card className="hover-3d h-full border-dashed">
            <CardContent className="h-full flex flex-col items-center justify-center py-10">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Thêm loại vé mới</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Tạo một loại vé mới để cung cấp cho khách hàng
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Thêm vé
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <TicketCheck className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy vé</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có loại vé nào khớp với tìm kiếm của bạn.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm loại vé mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketsTab;
