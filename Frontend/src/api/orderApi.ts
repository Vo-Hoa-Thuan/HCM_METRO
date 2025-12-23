import axios from "axios";
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/order`;

export const createPaymentOrder = async (orderForm: any, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderForm, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/update-status`, {
      orderId,
      paymentStatus
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    throw error;
  }
};

export const getPaymentById = async (orderId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    throw error;
  }
};

export const generateQRCode = async (orderId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/generate_qr/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.qrCode;
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error);
    throw error;
  }
};

