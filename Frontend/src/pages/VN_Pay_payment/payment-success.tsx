import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
import { updatePaymentStatus, getPaymentById } from '../../api/orderApi';
import { generateQRCode } from '../../api/orderApi';
import { motion } from "framer-motion";
import {
  TicketCheck, Calendar, MapPin, QrCode, Repeat, User,
  Phone, CreditCard, Clock, CheckCircle2, XCircle, ArrowRight
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PaymentResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('code');
  const orderId = queryParams.get('orderId');
  const { user } = useAuth();
  const { toast } = useToast();

  const [ticketInfo, setTicketInfo] = useState(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const updatePayment = async () => {
      try {
        if (!user?.token) {
          toast({
            variant: "destructive",
            description: "Vui lòng đăng nhập để xem thông tin vé"
          });
          return;
        }

        // Lấy thông tin vé
        const orderData = await getPaymentById(orderId, user.token);
        console.log("Thông tin đơn hàng:", orderData);
        setTicketInfo(orderData.data);

        // Nếu thanh toán thành công (code = 00), cập nhật trạng thái
        if (responseCode === '00') {
          const updateRes = await updatePaymentStatus(orderId, 'paid', user.token);
          console.log("Cập nhật trạng thái thanh toán:", updateRes);

          // Tạo mã QR cho vé
          const qrCodeData = await generateQRCode(orderId, user.token);
          setQrCode(qrCodeData);

          toast({
            description: "Thanh toán thành công!"
          });
        } else {
          await updatePaymentStatus(orderId, 'failed', user.token);
          toast({
            variant: "destructive",
            description: "Thanh toán thất bại!"
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thanh toán:", error);
        toast({
          variant: "destructive",
          description: "Có lỗi xảy ra khi cập nhật thông tin thanh toán"
        });
      }
    };

    if (orderId && responseCode) {
      updatePayment();
    }
  }, [orderId, responseCode, user?.token]);

  const isLimitedType = ["luot", "khu hoi", "nhom"].includes(ticketInfo?.ticketType);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("vi-VN");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              {responseCode === '00' ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                    Thanh toán thành công!
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Cảm ơn bạn đã mua vé. Dưới đây là thông tin chi tiết vé của bạn.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-red-600 mb-3">Thanh toán thất bại!</h1>
                  <p className="text-gray-600 text-lg">
                    Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                  </p>
                  <Button
                    className="mt-6 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600"
                    asChild
                  >
                    <a href="/tickets">Thử lại</a>
                  </Button>
                </motion.div>
              )}
            </div>

            {ticketInfo && responseCode === '00' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                {/* Thông tin khách hàng */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Thông tin khách hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Tên khách hàng</p>
                        <p className="font-medium text-gray-900">{ticketInfo.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Số điện thoại</p>
                        <p className="font-medium text-gray-900">{ticketInfo.userPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin vé */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">Chi tiết vé</h3>
                  <div className="grid gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TicketCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600">Loại vé</p>
                        <p className="font-medium text-gray-900">{ticketInfo.ticketType}</p>
                      </div>
                    </div>

                    {isLimitedType ? (
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Repeat className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600">Số lượt sử dụng</p>
                          <p className="font-medium text-gray-900">{ticketInfo.usageCount}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600">Thời hạn sử dụng</p>
                          <p className="font-medium text-gray-900">
                            {ticketInfo.expiryDate ? formatDate(ticketInfo.expiryDate) : 'Không có thời hạn'}
                          </p>
                        </div>
                      </div>
                    )}

                    {ticketInfo.routes && ticketInfo.routes.length > 0 && (
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600">Tuyến</p>
                          <div className="flex items-center gap-2 font-medium text-gray-900">
                            {ticketInfo.routes.map((route, index) => (
                              <div key={route} className="flex items-center">
                                {index > 0 && <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />}
                                <span>{route}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                {qrCode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border-2 border-gray-100 shadow-lg"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-6 h-6 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Mã QR của vé</h3>
                      <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48 object-contain" />
                      </div>
                      <p className="mt-6 text-sm text-gray-600">
                        Vui lòng lưu lại mã QR này để sử dụng khi đi tàu
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Footer Actions */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 hover:bg-gray-50"
                      asChild
                    >
                      <a href="/tickets">
                        <TicketCheck className="w-4 h-4 mr-2" />
                        Mua thêm vé
                      </a>
                    </Button>
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      asChild
                    >
                      <a href="/ticket-history">
                        <Clock className="w-4 h-4 mr-2" />
                        Xem lịch sử vé
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResult;
