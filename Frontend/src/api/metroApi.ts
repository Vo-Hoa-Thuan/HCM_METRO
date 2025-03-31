
import axios from 'axios';
import { Station, MetroLine, Ticket } from '@/utils/metroData';

// Xác định kiểu RouteStep và RouteOption
export type RouteStep = {
  type: 'walk' | 'metro';
  from: string;
  to: string;
  line?: string;
  duration: number;
  distance: number;
};

export type RouteOption = {
  id: string;
  steps: RouteStep[];
  totalDuration: number;
  totalDistance: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
};

// Cấu hình API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints cho dữ liệu metro
export const fetchStations = async (): Promise<Station[]> => {
  try {
    const response = await apiClient.get('/stations');
    return response.data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

export const fetchMetroLines = async (): Promise<MetroLine[]> => {
  try {
    const response = await apiClient.get('/lines');
    return response.data;
  } catch (error) {
    console.error('Error fetching metro lines:', error);
    throw error;
  }
};

export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await apiClient.get('/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const searchRoutes = async (
  origin: string,
  destination: string,
  time: string = 'now'
): Promise<RouteOption[]> => {
  try {
    const response = await apiClient.get('/routes/search', {
      params: { origin, destination, time },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching routes:', error);
    throw error;
  }
};

export const purchaseTicket = async (ticketId: string, quantity: number = 1) => {
  try {
    const response = await apiClient.post('/tickets/purchase', {
      ticketId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    throw error;
  }
};
