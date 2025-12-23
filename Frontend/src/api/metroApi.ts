import axios from 'axios';

// Định nghĩa URL API từ biến môi trường hoặc mặc định
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/';

// Định nghĩa các kiểu dữ liệu cho route planning
export interface RouteStep {
  type: 'metro' | 'walk';
  from: string;
  to: string;
  line?: string;
  duration: number;
  distance: number;
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

// Định nghĩa các kiểu dữ liệu cho API entities
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

// Define feedback interface
export interface Feedback {
  _id?: string;
  userId?: string;
  rating: number;
  comment?: string;
  source: string;
  date: string;
  status?: 'new' | 'reviewed' | 'resolved' | 'archived';
  response?: string;
  userEmail?: string;
  userName?: string;
}

// Define feedback stats interface
export interface FeedbackStats {
  totalCount: number;
  averageRating: number;
  ratingsDistribution: {
    [key: number]: number;
  };
  sourceDistribution: {
    [key: string]: number;
  };
  statusDistribution: {
    [key: string]: number;
  };
  recentTrend: {
    date: string;
    count: number;
    averageRating: number;
  }[];
}

// Tạo instance axios với xử lý lỗi và JWT token
const api = axios.create({
  baseURL: API_URL,
});

// Thêm JWT token vào requests nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Xử lý JWT token hết hạn
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ, chuyển hướng đến trang đăng nhập
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: Chuyển hướng đến trang đăng nhập
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

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

// Import mock data để sử dụng khi API không khả dụng
import { mockTickets, mockLines, mockStations } from '@/utils/mockData';

// Metro Lines
export const getAllLines = async (params = {}) => {
  return handleApiCall(api.get('/lines', { params }), { lines: mockLines });
};

export const getLineById = async (id: string) => {
  return handleApiCall(api.get(`/lines/${id}`), mockLines.find(line => line.id === id) || null);
};

export const createLine = async (lineData: Partial<MetroLine>) => {
  return await api.post('/lines', lineData);
};

export const updateLine = async (id: string, lineData: Partial<MetroLine>) => {
  return await api.put(`/lines/${id}`, lineData);
};

export const deleteLine = async (id: string) => {
  return await api.delete(`/lines/${id}`);
};

export const getRealTimeTrains = async () => {
  return handleApiCall(api.get('/trains/realtime'), []);
};

// Stations
export const getAllStations = async (params = {}) => {
  return handleApiCall(api.get('/stations', { params }), { stations: mockStations });
};

export const getStationById = async (id: string) => {
  return handleApiCall(api.get(`/stations/${id}`), mockStations.find(station => station.id === id) || null);
};

export const createStation = async (stationData: Partial<Station>) => {
  return await api.post('/stations', stationData);
};

export const updateStation = async (id: string, stationData: Partial<Station>) => {
  return await api.put(`/stations/${id}`, stationData);
};

export const deleteStation = async (id: string) => {
  return await api.delete(`/stations/${id}`);
};

// Routes 
export const searchRoutes = async (origin: string, destination: string, time: string): Promise<RouteOption[]> => {
  return handleApiCall(
    api.get('/routes/search', { params: { origin, destination, time } }),
    []
  );
};

// Tickets
export const getAllTickets = async (params = {}) => {
  return handleApiCall(api.get('/tickets', { params }), { tickets: mockTickets });
};

export const getTicketById = async (id: string) => {
  return handleApiCall(api.get(`/tickets/${id}`), mockTickets.find(ticket => ticket.id === id) || null);
};

export const createTicket = async (ticketData: Partial<Ticket>) => {
  return await api.post('/tickets', ticketData);
};

export const updateTicket = async (id: string, ticketData: Partial<Ticket>) => {
  return await api.put(`/tickets/${id}`, ticketData);
};

export const deleteTicket = async (id: string) => {
  return await api.delete(`/tickets/${id}`);
};

export const purchaseTicket = async (ticketId: string, quantity: number, userId?: string) => {
  return await api.post('/tickets/purchase', { ticketId, quantity, userId });
};

// Users
export const getAllUsers = async (params = {}) => {
  return handleApiCall(api.get('/users', { params }), { users: [] });
};

export const getUserById = async (id: string) => {
  return handleApiCall(api.get(`/users/${id}`), null);
};

export const createUser = async (userData: Partial<User>) => {
  return await api.post('/users', userData);
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  return await api.put(`/users/${id}`, userData);
};

export const deleteUser = async (id: string) => {
  return await api.delete(`/users/${id}`);
};

export const updateUserPreferences = async (id: string, preferencesData: any) => {
  return await api.put(`/users/${id}/preferences`, preferencesData);
};

export const exportUsers = async () => {
  return handleApiCall(api.get('/users/export'), { url: '' });
};

// Feedback
export const getAllFeedback = async (params = {}) => {
  return handleApiCall(api.get('/feedback', { params }), { feedback: [] });
};

export const getFeedbackById = async (id: string) => {
  return handleApiCall(api.get(`/feedback/${id}`), null);
};

export const submitFeedback = async (feedbackData: Omit<Feedback, 'date' | '_id' | 'status'>) => {
  return handleApiCall(
    api.post('/feedback', {
      ...feedbackData,
      date: new Date().toISOString(),
      status: 'new'
    }),
    { success: true, message: 'Feedback submitted successfully' }
  );
};

export const updateFeedback = async (id: string, feedbackData: Partial<Feedback>) => {
  return handleApiCall(
    api.put(`/feedback/${id}`, feedbackData),
    { success: true, message: 'Feedback updated successfully' }
  );
};

export const deleteFeedback = async (id: string) => {
  return handleApiCall(
    api.delete(`/feedback/${id}`),
    { success: true, message: 'Feedback deleted successfully' }
  );
};

export const getFeedbackStats = async () => {
  return handleApiCall(
    api.get('/feedback/stats'),
    {
      totalCount: 0,
      averageRating: 0,
      ratingsDistribution: {},
      sourceDistribution: {},
      statusDistribution: {},
      recentTrend: []
    }
  );
};
