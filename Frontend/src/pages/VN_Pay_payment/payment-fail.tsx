import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TicketCheck, Calendar, MapPin, QrCode, Repeat, User, Phone } from "lucide-react";
import { useEffect, useState } from 'react';
import { getPaymentById, generateQRCode } from '../../api/orderApi';
import { motion } from "framer-motion";


const PaymentFailPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId'); // Lấy mã đơn hàng từ URL
  const errorCode = queryParams.get('code'); // Lấy mã lỗi từ URL

  const [ticketInfo, setTicketInfo] = useState(null);
  const [qrCode, setQrCode] = useState(null);


  useEffect(() => {
    if (errorCode !== '00' && orderId) {
      getPaymentById(orderId, 'FAILED')
        .then((response) => {
          setTicketInfo(response.data);

          // Không cập nhật trạng thái, chỉ tạo QR
          generateQRCode(orderId, 'FAILED')
            .then((qr) => {
              setQrCode(qr);
            })
            .catch((error) => console.error('Lỗi khi tạo QR:', error));
        })
        .catch((error) => {
          console.error('Lỗi khi lấy thông tin vé: ', error);
        });
    }
  }, [errorCode, orderId]);


  console.log("Vé", ticketInfo)

  const isLimitedType = ["luot", "khu hoi", "nhom"].includes(ticketInfo?.ticketType)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("vi-VN");

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 text-gray-800">
      <Navbar />

      <div className="text-center pt-[80px] py-4">
        <h1 className="text-xl font-semibold text-blue-700">❌ Thanh toán thất bại</h1>
        <p className="text-sm text-red-600 mt-2">Đã có lỗi xảy ra trong quá trình thanh toán. Mã lỗi: {errorCode}</p>
      </div>

      <main className="flex-grow flex items-center justify-center p-6">
        {ticketInfo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl  w-full bg-white border-2 border-blue-100 rounded-3xl shadow-xl relative p-6"
          >
            {/* Header vé */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <TicketCheck className="w-5 h-5" />
                Vé điện tử
              </h2>
              <span className="text-sm text-blue-600">Mã vé: {ticketInfo.orderId}</span>
            </div>

            {/* Nội dung vé và mã QR */}
            <div className="flex justify-between space-x-6">
              {/* Thông tin vé bên trái */}
              <div className="space-y-3 text-sm flex-grow">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Người mua: {ticketInfo?.userName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>SĐT: {ticketInfo.userPhone}</span>
                </div>

                {isLimitedType && (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>
                        {ticketInfo.routes[0]} → {ticketInfo.routes[ticketInfo.routes.length - 1]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-blue-600" />
                      <span>
                        Loại vé:
                        {ticketInfo?.ticketType === "luot"
                          ? "Vé lượt"
                          : ticketInfo?.ticketType === "khuhoi"
                            ? "Vé khứ hồi"
                            : ticketInfo?.ticketType === "nhom"
                              ? "Vé nhóm"
                              : "Vé khác"}
                      </span>
                    </div>
                  </>
                )}

                {!isLimitedType && (
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-blue-600" />
                    <span>
                      Loại vé:
                      {ticketInfo?.ticketType === "thang"
                        ? " Vé tháng"
                        : ticketInfo?.ticketType === "tuan"
                          ? " Vé tuần"
                          : " Vé ngày"}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Ngày mua: {formatDate(ticketInfo.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className={errorCode !== '00' ? 'text-red-500 font-medium' : ''}>
                    {errorCode === '00' ? (
                      isLimitedType ? (
                        <>
                          Hạn sử dụng: {ticketInfo.usageCount ?? 0} lượt
                          {ticketInfo.ticketType === 'nhom' && ticketInfo.groupSize && (
                            <> • {ticketInfo.groupSize} người</>
                          )}
                        </>
                      ) : (
                        <>Hạn dùng: {formatDate(ticketInfo.expiryDate)}</>
                      )
                    ) : (
                      <>Trạng thái: Chưa thanh toán</>
                    )}
                  </span>
                </div>
              </div>
              {/* Mã QR bên phải */}
              <div className="flex-shrink-0 flex justify-center items-center">
                <div className="border-2 border-dashed border-blue-300 p-3 rounded-xl">
                  <img src={qrCode} alt="QR Code" className="w-40 h-40" />
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </main>


      <div className="text-center py-4">
        <a
          href="/"
          className="text-blue-600 font-medium hover:underline transition"
        >
          ← Quay lại trang chủ
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentFailPage;
