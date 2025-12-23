import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTicketById } from "@/api/ticketsAPI";
import { formatPrice } from "@/api/ticketsAPI";
import { Fragment } from "react";
import { createVNPayUrl } from "@/api/VnpayApi";
import { createPaymentOrder } from "@/api/orderApi";
import { toast } from "@/components/ui/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Dữ liêụ nhận từ Vé (Chủ yếu là vé không giới hạn lượt)
  const { ticketId, quantity, ticketName, ticketPrice } = location.state || {};

  // Dữ liệu nhận từ Tra Cứu Lộ Trình (Đầy đủ thông tin, chủ yếu là vé có giới hạn lượt)
  const { fare, origin, destination, quantities, route, ticketType, discountPercent } = location.state || {};

  const [errors, setErrors] = useState({});
  const newErrors: { [key: string]: string } = {};

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    idNumber: "",
    sub_type: "",
    paymentMethod: "",
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.idNumber.trim()) {
      newErrors.idNumber = "Số CMND/CCCD không được để trống";
    }

    if (!form.sub_type) {
      newErrors.sub_type = "Vui lòng chọn đối tượng mua vé";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const ticket = await getTicketById(ticketId);
        console.log("Dữ liệu vé:", ticket);
        setTicketData(ticket);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu vé:", err);
      }
    };
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  if (!localStorage.getItem("accessToken")) {
    return <p>Bạn cần đăng nhập để truy cập trang này.</p>;
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      console.log("Form không hợp lệ:", errors);
      return;
    }

    try {
      const orderId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const total = calculateTotalPrice();

      // Lấy token từ context
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          variant: "destructive",
          description: "Vui lòng đăng nhập để tiếp tục"
        });
        return;
      }

      // Tạo đối tượng dữ liệu đơn hàng (order form)
      let orderForm: any = {
        orderId,
        userName: form.fullName,
        ticketType: ticketType || ticketData?.category,
        userPhone: form.phone,
        paymentMethod: form.paymentMethod,
        totalPrice: total,
        paymentStatus: 'pending',
        routes: route,
        quantities: quantities || 1,
        createdAt: new Date().toISOString(),
      };

      if (["ngay", "tuan", "thang"].includes(orderForm.ticketType)) {
        const expireDate = new Date();
        if (orderForm.ticketType === "day") expireDate.setDate(expireDate.getDate() + 1);
        if (orderForm.ticketType === "week") expireDate.setDate(expireDate.getDate() + 7);
        if (orderForm.ticketType === "month") expireDate.setMonth(expireDate.getMonth() + 1);
        orderForm.expiredAt = expireDate.toISOString();
      }

      // Nếu là vé giới hạn lượt: thêm số người / lượt
      if (["luot", "nhom", "khu hoi"].includes(orderForm.ticketType)) {
        orderForm.groupSize = form.groupSize || 1;
      }

      console.log("Order Form:", orderForm);

      const orderRes = await createPaymentOrder(orderForm, token);
      console.log("Order đã được lưu:", orderRes);

      switch (form.paymentMethod) {
        case "vnpay": {
          const paymentUrl = await createVNPayUrl(total, orderId);
          console.log("Link thanh toán:", paymentUrl);
          window.location.href = paymentUrl;
          break;
        }

        case "card": {
          console.log("Thanh toán bằng thẻ tín dụng - chưa tích hợp");
          break;
        }

        case "qr": {
          console.log("Thanh toán bằng mã QR - đang phát triển");
          break;
        }

        case "metro": {
          console.log("Sử dụng thẻ Metro để thanh toán - xác thực từ backend");
          break;
        }

        default:
          console.warn("Chưa chọn hình thức thanh toán hợp lệ.");
      }

      console.log("Tổng tiền:", total);

    } catch (err) {
      console.error("Lỗi khi xử lý thanh toán:", err);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra khi xử lý thanh toán"
      });
    }
  };


  const isLimitedUseTicket = ["luot", "nhom", "khu hoi"].includes(ticketType) || ticketType;
  const isUnlimitedUseTicket = ["ngay", "tuan", "thang"].includes(ticketData?.category);

  const calculateTotalPrice = () => {
    const isLimited = ["luot", "khu hoi", "nhom"].includes(ticketType);

    const base = ticketData?.price ?? fare;
    const qty = isLimited ? (quantities || 1) : (quantity || 1);
    const gross = base * qty;

    const ticketDiscount = isLimited ? (discountPercent || 0) : (ticketData?.discount_percent || 0);

    let additionalDiscount = 0;
    if (form.sub_type === "sinhvien") additionalDiscount += 20;
    if (form.sub_type === "nguoi_cao_tuoi") additionalDiscount += 30;

    const totalDiscount = ticketDiscount + additionalDiscount;

    const total = gross * (1 - totalDiscount / 100);
    const roundedTotal = Math.round(total / 1000) * 1000;

    return roundedTotal;
  };

  const today = new Date();
  let availableUntil = "";

  if (ticketData?.category === "ngay") {
    availableUntil = today.toLocaleDateString("vi-VN");
  } else if (ticketData?.category === "tuan") {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    availableUntil = nextWeek.toLocaleDateString("vi-VN");
  } else if (ticketData?.category === "thang") {
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    availableUntil = nextMonth.toLocaleDateString("vi-VN");
  } else {
    availableUntil = "31/12/2025";
  }

  return (
    <div className="min-h-screen flex flex-col caret-transparent">
      <Navbar />
      <div className="px-10 mt-6 p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Mua vé Online
        </h1>
      </div>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 ">
        <section className="lg:col-span-2 space-y-6">
          {isLimitedUseTicket && (
            <Card>
              <CardHeader className="bg-blue-600 text-white rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Tuyến METRO số 1</h2>
                    <p>{origin} ↔ {destination}</p>
                  </div>
                  <Badge variant="secondary">
                    Loại vé: {
                      ticketType === 'luot' ? 'Lượt' :
                        ticketType === 'khu_hoi' ? 'Khứ Hồi' :
                          ticketType === 'nhom' ? 'Nhóm' :
                            'Không xác định'
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="flex justify-between text-sm">
                  <span><strong>Ga khởi hành:  {origin}</strong></span>
                  <span>{ticketData?.departureTime || "Thiết kế hệ thống thời gian sau"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span><strong>Ga đích: {destination}</strong></span>
                  <span>{ticketData?.departureDate || "Thiết kế hệ thống thời gian sau"}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm">
                  <span>Thời gian di chuyển</span>
                  <span>{ticketData?.duration || "Sẽ xây dựng hàm tính thời gian di chuyển dựa trên khoảng cách"}</span>
                </div>
                <div className="flex flex-col border-t pt-2 text-sm">
                  <span className="mb-1 font-medium text-gray-600">Lộ trình di chuyển</span>
                  <div className="space-y-2">
                    {ticketType === "khu hoi" ? (
                      <>
                        {/* Lộ trình lượt đi */}
                        <div className="bg-blue-50 p-3 rounded-md">
                          <strong>Lộ trình lượt đi:</strong>
                          <div className="flex items-center space-x-2 mt-1">
                            {route?.map((station, index) => (
                              <Fragment key={index}>
                                <span className="bg-blue-200 px-3 py-1 rounded-lg text-blue-800 font-semibold">
                                  {station}
                                </span>
                                {index !== route.length - 1 && (
                                  <span className="text-gray-500">→</span>
                                )}
                              </Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Lộ trình lượt về */}
                        <div className="bg-blue-50 p-3 rounded-md">
                          <strong>Lộ trình lượt về:</strong>
                          <div className="flex items-center space-x-2 mt-1">
                            {route?.slice().reverse().map((station, index) => (
                              <Fragment key={index}>
                                <span className="bg-blue-200 px-3 py-1 rounded-lg text-blue-800 font-semibold">
                                  {station}
                                </span>
                                {index !== route.length - 1 && (
                                  <span className="text-gray-500">→</span>
                                )}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Lộ trình 1 chiều
                      <div className="bg-blue-50 p-3 rounded-md">
                        <strong>Lộ trình:</strong>
                        <div className="flex items-center space-x-2 mt-1">
                          {route?.map((station, index) => (
                            <Fragment key={index}>
                              <span className="bg-blue-200 px-3 py-1 rounded-lg text-blue-800 font-semibold">
                                {station}
                              </span>
                              {index !== route.length - 1 && (
                                <span className="text-gray-500">→</span>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}


          {isUnlimitedUseTicket && (
            <Card className="border border-blue-200 shadow-sm">
              <CardHeader className="bg-blue-50 text-blue-800 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{ticketData?.name}</h2>
                    <p className="text-sm text-blue-600">
                      Loại vé: {
                        ticketData?.category === 'ngay' ? 'Ngày' :
                          ticketData?.category === 'tuan' ? 'Tuần' :
                            ticketData?.category === 'thang' ? 'Tháng' :
                              'Không xác định'
                      }
                    </p>

                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-600">
                    Không giới hạn lượt
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="bg-white space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian hiệu lực</span>
                  <span className="font-medium text-blue-700">
                    Từ hôm nay đến {availableUntil}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Vé có thể sử dụng <strong className="text-blue-600">không giới hạn số lượt</strong> trong thời gian hiệu lực.
                </div>
              </CardContent>
            </Card>
          )}


          <Card className="border border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 text-blue-800 rounded-t-xl">
              <h2 className="text-lg font-bold">Thông tin người mua</h2>
              <p className="text-sm text-blue-600">Vui lòng nhập đầy đủ thông tin để tiếp tục thanh toán</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Họ và tên</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Số điện thoại</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Email</label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Số CMND/CCCD */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Số CMND/CCCD</label>
                <Input
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  placeholder="Nhập số CMND/CCCD"
                />
                {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
              </div>

              {/* Đối tượng mua vé */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-700">Đối tượng mua vé</label>
                <Select value={form.sub_type} onValueChange={(value) => setForm({ ...form, sub_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nguoi_cao_tuoi">Người cao tuổi</SelectItem>
                    <SelectItem value="sinhvien">Sinh viên</SelectItem>
                    <SelectItem value="thuong">Người lớn</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sub_type && <p className="text-red-500 text-sm">{errors.sub_type}</p>}
              </div>
            </CardContent>
          </Card>

        </section>

        <aside className="space-y-6">
          <Card className="border border-blue-200 shadow-sm rounded-xl">
            <CardHeader className="bg-blue-50 text-blue-800 rounded-t-xl">
              <h2 className="text-lg font-bold">Tổng thanh toán</h2>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-gray-700">

              {["luot", "khu hoi", "nhom"].includes(ticketType) ? (
                <>
                  <div className="flex justify-between">
                    <span>Tiền vé theo lượt</span>
                    <span>{formatPrice(ticketData?.price || fare)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Số lượng</span>
                    <span>{quantities || 1}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>
                      {formatPrice((ticketData?.price ?? fare) * (quantities || 1))}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>
                      {(() => {
                        let totalDiscount = discountPercent || 0;
                        if (form.sub_type === "sinhvien") totalDiscount += 20;
                        if (form.sub_type === "nguoi_cao_tuoi") totalDiscount += 30;
                        return totalDiscount > 0 ? `${totalDiscount}%` : "Không áp dụng";
                      })()}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-semibold text-base text-blue-800">
                    <span>Tổng cộng</span>
                    <span>
                      {calculateTotalPrice().toLocaleString()}đ
                    </span>
                  </div>
                </>
              ) : (
                // Vé không giới hạn lượt
                <>
                  <div className="flex justify-between">
                    <span>Loại vé</span>
                    <span className="capitalize">{ticketData?.ticketType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Giá vé</span>
                    <span>{formatPrice(ticketData?.price || fare)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>
                      {(() => {
                        let total = ticketData?.discount_percent || 0;
                        if (form.sub_type === "sinhvien") total += 20;
                        if (form.sub_type === "nguoi_cao_tuoi") total += 30;
                        return total > 0 ? `${total}%` : "Không áp dụng";
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Số lượng</span>
                    <span>{quantity || 1}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between font-semibold text-base text-blue-800">
                    <span>Tổng cộng</span>
                    <span>
                      {calculateTotalPrice().toLocaleString()}đ
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>


          <Card className="border border-blue-200 shadow-sm rounded-xl">
            <CardHeader className="bg-blue-50 text-blue-800 rounded-t-xl">
              <h2 className="text-lg font-bold">Hình thức thanh toán</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup value={form.paymentMethod} onValueChange={(value) => {
                console.log("Phương thức thanh toán đã chọn:", value);
                setForm({ ...form, paymentMethod: value });
              }}>
                {[
                  { value: "card", label: "Thẻ tín dụng / ghi nợ", icon: "iconcard.png" },
                  { value: "qr", label: "Quét mã QR", icon: "iconmaqr.jpg" },
                  { value: "vnpay", label: "Ví VN-Pay", icon: "iconvnpay.jpg" },
                  { value: "metro", label: "Thẻ Metro", icon: "iconthemetro.png" },
                ].map((method) => (
                  <div
                    key={method.value}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition 
                                    ${form.paymentMethod === method.value
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-300 hover:border-blue-400"}`}
                    onClick={() => setForm({ ...form, paymentMethod: method.value })}
                  >
                    <div className="flex items-center space-x-2">
                      <img src={method.icon} alt={method.label} className="w-12 h-12" />
                      <RadioGroupItem value={method.value} id={method.value} />
                      <label htmlFor={method.value} className="text-sm">{method.label}</label>
                    </div>
                  </div>
                ))}

              </RadioGroup>
            </CardContent>
          </Card>

          <Button className="w-full text-white text-lg h-12 bg-blue-600 hover:bg-blue-700 mt-4" onClick={handlePayment}>
            Thanh toán ➜
          </Button>

          <p className="text-xs text-center text-gray-500 mt-2">
            Vé sẽ có hiệu lực trong ngày sau khi thanh toán thành công.
          </p>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
