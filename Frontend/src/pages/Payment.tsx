import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tickets, getTicketById} from "@/api/ticketsAPI"; 

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin từ state được truyền qua navigate
  const { ticketId, quantity, ticketName, ticketPrice } = location.state || {};
  console.log("Thông tin vé:", ticketId, quantity, ticketName, ticketPrice);

  if (!localStorage.getItem("accessToken")) {
    return <p>Bạn cần đăng nhập để truy cập trang này.</p>;
  }

  // Tính tổng tiền
  const totalPrice = (ticketPrice || 0) * (quantity || 1);

  const handlePayment = () => {
    console.log("Thanh toán thành công!");
    // Điều hướng đến trang xác nhận hoặc trang chủ
    navigate("/confirmation", { state: { ticketId, quantity, totalPrice } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Thanh toán</h1>
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin vé</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Tên vé:</span>
              <span>{ticketName || "Không xác định"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Số lượng:</span>
              <span>{quantity || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Giá vé:</span>
              <span>{ticketPrice ? `${ticketPrice.toLocaleString()} VND` : "0 VND"}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold text-lg">Tổng tiền:</span>
              <span className="font-bold text-lg">{totalPrice.toLocaleString()} VND</span>
            </div>
          </div>
          <Button
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handlePayment}
          >
            Xác nhận thanh toán
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;