import axios, { AxiosResponse } from 'axios';
import { mockTickets, mockLines, mockStations } from '@/utils/mockData';

const API_URL = "http://localhost:5000"; // Kiểm tra lại giá trị này


// Define types for route planning
export interface RouteStep {
  type: 'metro' | 'walk';
  from: string;
  to: string;
  line?: string;
  duration: number;
  distance: number;
}

// Define feedback interface
export interface Feedback {
  userId?: string;
  rating: number;
  comment?: string;
  source: string;
  date: string;
}

export interface RouteOption {
  id: string;
  steps: RouteStep[];
  totalDuration: number;
  totalDistance: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

// Define types for API entities
export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
  operatingHours: {
    weekday: string;
    weekend: string;
  };
  frequency: {
    peakHours: string;
    offPeakHours: string;
  };
  status: 'operational' | 'construction' | 'planned' | 'closed';
  openingDate?: string;
  length: number;
  alerts?: Array<{
    type: 'delay' | 'closure' | 'maintenance' | 'info';
    message: string;
    startDate: string;
    endDate: string;
    active: boolean;
  }>;
}

export interface Station {
  id: string;
  name: string;
  nameVi: string;
  coordinates: [number, number];
  lines: string[];
  facilities: string[];
  isInterchange: boolean;
  image?: string;
  address?: string;
  status: 'operational' | 'construction' | 'planned' | 'closed';
  openingDate?: string;
  dailyPassengers?: number;
  hasWifi: boolean;
  hasParking: boolean;
  hasTicketMachine: boolean;
  hasAccessibility: boolean;
  hasBathroom: boolean;
}

export interface Ticket {
  id: string;
  type: string;
  name: string;
  price: number;
  description: string;
  validityPeriod?: string;
  restrictions?: string;
  isDiscounted: boolean;
  discountPercentage: number;
  availableFrom?: string;
  availableUntil?: string;
  status: 'active' | 'inactive';
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'User' | 'Moderator' | 'Admin';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      app: boolean;
    };
    language: string;
  };
  lastActive?: string;
  createdAt: string;
}

// Set up axios instance with error handling
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Metro Lines
export const getAllLines = async (params = {}) => {
  try {
    const response = await api.get('/lines', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get lines:', error);
    return { lines: mockLines };
  }
};

export const getLineById = async (id: string) => {
  try {
    const response = await api.get(`/lines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get line ${id}:`, error);
    const mockLine = mockLines.find(line => line.id === id);
    return mockLine || null;
  }
};

export const createLine = async (lineData: Partial<MetroLine>) => {
  try {
    const response = await api.post('/lines', lineData);
    return response.data;
  } catch (error) {
    console.error('Failed to create line:', error);
    throw error;
  }
};

export const updateLine = async (id: string, lineData: Partial<MetroLine>) => {
  try {
    const response = await api.put(`/lines/${id}`, lineData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update line ${id}:`, error);
    throw error;
  }
};

export const deleteLine = async (id: string) => {
  try {
    const response = await api.delete(`/lines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete line ${id}:`, error);
    throw error;
  }
};

// Stations
export const getAllStations = async (params = {}) => {
  try {
    const response = await api.get('/stations', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get stations:', error);
    return { stations: mockStations };
  }
};

export const getStationById = async (id: string) => {
  try {
    const response = await api.get(`/stations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get station ${id}:`, error);
    const mockStation = mockStations.find(station => station.id === id);
    return mockStation || null;
  }
};

export const createStation = async (stationData: Partial<Station>) => {
  try {
    const response = await api.post('/stations', stationData);
    return response.data;
  } catch (error) {
    console.error('Failed to create station:', error);
    throw error;
  }
};

export const updateStation = async (id: string, stationData: Partial<Station>) => {
  try {
    const response = await api.put(`/stations/${id}`, stationData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update station ${id}:`, error);
    throw error;
  }
};

export const deleteStation = async (id: string) => {
  try {
    const response = await api.delete(`/stations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete station ${id}:`, error);
    throw error;
  }
};

// Routes - Adding the missing searchRoutes function
export const searchRoutes = async (origin: string, destination: string, time: string): Promise<RouteOption[]> => {
  try {
    const response = await api.get('/routes/search', {
      params: { origin, destination, time }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search routes:', error);
    return [];
  }
};

// Tickets
export const getAllTickets = async (params = {}) => {
  try {
    const response = await api.get('/tickets', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get tickets:', error);
    return { tickets: mockTickets };
  }
};

export const getTicketById = async (id: string) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get ticket ${id}:`, error);
    const mockTicket = mockTickets.find(ticket => ticket.id === id);
    return mockTicket || null;
  }
};

export const createTicket = async (ticketData: Partial<Ticket>) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Failed to create ticket:', error);
    throw error;
  }
};

export const updateTicket = async (id: string, ticketData: Partial<Ticket>) => {
  try {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ticket ${id}:`, error);
    throw error;
  }
};

export const deleteTicket = async (id: string) => {
  try {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete ticket ${id}:`, error);
    throw error;
  }
};

export const purchaseTicket = async (ticketId: string, quantity: number, userId?: string) => {
  try {
    const response = await api.post('/tickets/purchase', { ticketId, quantity, userId });
    return response.data;
  } catch (error) {
    console.error('Failed to purchase ticket:', error);
    throw error;
  }
};

// Users
export const getAllUsers = async () => {
  try {
    console.log("🟢 Đang gọi API:", `${API_URL}/users`);
    const response = await axios.get(`${API_URL}/users`);
    console.log("✅ API trả về:", response.data);

    return response.data || []; // Trả về mảng rỗng nếu không có dữ liệu
  } catch (error) {
    console.error("❌ Lỗi gọi API:", error.message);
    console.error("📌 Chi tiết lỗi:", error.response ? error.response.data : error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};



export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    throw error;
  }
};

export const updateUserPreferences = async (id: string, preferencesData: any) => {
  try {
    const response = await api.put(`/users/${id}/preferences`, preferencesData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user preferences ${id}:`, error);
    throw error;
  }
};

export const exportUsers = async () => {
  try {
    const response = await api.get('/users/export');
    return response.data;
  } catch (error) {
    console.error('Failed to export users:', error);
    throw error;
  }
};

// Feedback
export const submitFeedback = async (feedbackData: Omit<Feedback, 'date'>) => {
  return handleApiCall(
    api.post('/feedback', {
      ...feedbackData,
      date: new Date().toISOString()
    }),
    { success: true, message: 'Feedback submitted successfully' }
  );
};
// Tạo một function tổng quát để xử lý API calls
const handleApiCall = async (apiCall: Promise<any>, mockData: any) => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    // Trả về mock data nếu API call thất bại
    return mockData;
  }
};
