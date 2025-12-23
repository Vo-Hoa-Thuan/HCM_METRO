import axios from "axios";
import { BASE_URL } from '@/config';
const API_URL = `${BASE_URL}/vnpay`;


export const createVNPayUrl = async (amount: number, orderId: string) => {
  try {
    const response = await axios.post(`${API_URL}/create_payment_url`, {
      amount,
      orderId,
    });
    return response.data.paymentUrl;
  } catch (error) {
    console.error("Error fetching VNPAY payment URL:", error);
    throw error;
  }
}

export const verifyVNPayReturn = async (queryParams: URLSearchParams) => {
  try {
    const response = await axios.get(`${API_URL}/vnpay_return`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying VNPAY return:", error);
    throw error;
  }
};

