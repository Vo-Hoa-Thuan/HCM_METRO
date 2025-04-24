import axios from "axios";

const API_URL = "http://localhost:5000/order";


export const createPaymentOrder = async (orderForm) => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderForm);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await axios.post(`${API_URL}/update-status`, {
      orderId,
      paymentStatus
    });
    return response.data;  // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    throw error;
  }
};

export const getPaymentById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;  
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    throw error;
  }
};

export const generateQRCode = async (orderId: string) => {
  try {
    const response = await axios.get(`${API_URL}/generate_qr/${orderId}`);
    return response.data.qrCode;
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error);
    throw error;
  }
};

