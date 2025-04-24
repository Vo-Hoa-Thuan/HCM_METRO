import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoutePlanner from '@/components/route/RoutePlanner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Train, Map, Clock , Wallet, Users, CalendarDays, CreditCard, QrCode } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { getTicketTypes, getTicketsByType, getTickets, formatPrice } from '@/api/ticketsAPI';

const RoutesAndTickets = () => {

  const [selectedTab, setSelectedTab] = useState('');
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Chọn lộ trình di chuyển
          </h1>
          <p className="text-muted-foreground text-lg">
            Tìm kiếm và lập kế hoạch cho hành trình của bạn trên hệ thống tàu điện metro TP.HCM.
          </p>
        </div>
        
        <RoutePlanner />
        

        
        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100 dark:border-blue-900">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
                <Train className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-lg">Tốc độ cao</h3>
            </div>
            <p className="text-muted-foreground">
              Tuyến Metro TP.HCM với tốc độ trung bình 35 km/h giúp bạn tiết kiệm thời gian di chuyển.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100 dark:border-blue-900">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
                <Map className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium text-lg">Kết nối thuận tiện</h3>
            </div>
            <p className="text-muted-foreground">
              Hệ thống kết nối các điểm quan trọng trong thành phố, giúp bạn di chuyển dễ dàng.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-blue-100 dark:border-blue-900">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-lg">Lịch trình đáng tin cậy</h3>
            </div>
            <p className="text-muted-foreground">
              Hệ thống hoạt động từ 5:00 đến 22:00 hàng ngày với tần suất 5-10 phút/chuyến giờ cao điểm.
            </p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-xl shadow-lg text-white text-center">
          <CalendarDays className="h-10 w-10 mx-auto mb-4 opacity-75" />
          <h3 className="text-2xl font-bold mb-2">Lên kế hoạch trước cho chuyến đi của bạn</h3>
          <p className="text-blue-100 dark:text-blue-200 max-w-xl mx-auto">
            Sử dụng tính năng tìm kiếm lộ trình để lên kế hoạch cho chuyến đi của bạn trước khi bắt đầu hành trình. Điều này giúp bạn tiết kiệm thời gian và đảm bảo chuyến đi suôn sẻ.
          </p>
        </div>
      </main>
      <Footer />
    </div>

  );
};

export default RoutesAndTickets;
