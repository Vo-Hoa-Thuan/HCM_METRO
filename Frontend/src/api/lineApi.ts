import axios from "axios";
import { BASE_URL } from '@/config';
// Định nghĩa URL API từ biến môi trường hoặc mặc định
const API_URL = `${BASE_URL}`;

export interface MetroLine {
  id: string;
  _id: string;
  name: string;
  color: string;
  stations: Array<{
    station: string; // ID của station
    order: number;   // Thứ tự trong tuyến
  }>;

  operatingHours: {
    weekday: string;
    weekend: string;
  };
  frequency: {
    peakHours: string;
    offPeakHours: string;
  };
  status: "operational" | "construction" | "planned" | "closed";
  openingDate: string;
  length: number;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface Station {
  _id: string;
  name: string;
  nameVi: string;
  status: string;
}

export interface RealTimeInfo {
  nextTrainTime: number;
  crowdLevel: 'low' | 'medium' | 'high';
  delayMinutes: number;
}

export interface RouteResponse {
  message: string;
  path: string[];
  stations: Station[];
  fare: number;
  duration: number;
  realTimeInfo: Record<string, RealTimeInfo>;
}

export const getAllLines = async () => {
  try {
    const response = await axios.get(`${API_URL}/lines`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tuyến:', error);
    throw new Error('Không thể lấy danh sách tuyến');
  }
};

export const getLineById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/lines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tuyến:', error);
    throw new Error('Không thể lấy thông tin tuyến');
  }
};

export const createLine = async (metroLine: MetroLine): Promise<MetroLine> => {
  try {
    const response = await axios.post(`${API_URL}/lines`, metroLine);
    return response.data;
  } catch (error) {
    console.error("Error creating metro line:", error);
    throw error;
  }
};

export const updateLine = async (id: string, metroLine: Partial<MetroLine>): Promise<MetroLine> => {
  try {
    const response = await axios.put(`${API_URL}/lines/${id}`, metroLine);
    return response.data;
  } catch (error) {
    console.error(`Error updating metro line with id ${id}:`, error);
    throw error;
  }
};

export const deleteLine = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/lines/${id}`);
  } catch (error) {
    console.error(`Error deleting metro line with id ${id}:`, error);
    throw error;
  }
};

export const searchRoutes = async (origin: string, destination: string): Promise<RouteResponse> => {
  try {
    const response = await axios.get(`${API_URL}/lines/search`, {
      params: { origin, destination },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Không thể tìm thấy lộ trình');
    }
  } catch (error) {
    console.error('Lỗi khi tìm tuyến đường:', error);
    throw new Error(error.response?.data?.message || 'Lỗi hệ thống khi tìm tuyến đường');
  }
};

export const getStationsByLineId = async (lineId: string) => {
  try {
    const response = await axios.get(`${API_URL}/lines/${lineId}/stations`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ga:', error)
    throw new Error('Không thể lấy danh sách ga');
  }
};