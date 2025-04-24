import axios from "axios";
import { Key } from "readline";

const API_URL = "http://localhost:5000/lines"; 

export interface MetroLine {
  id: Key;
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

export const getAllLines = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching metro lines:", error);
    throw error;
  }
};

export const getLineById = async (id: string): Promise<MetroLine> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching metro line with id ${id}:`, error);
    throw error;
  }
};

export const createLine = async (metroLine: MetroLine): Promise<MetroLine> => {
  try {
    const response = await axios.post(`${API_URL}/`, metroLine);
    return response.data;
  } catch (error) {
    console.error("Error creating metro line:", error);
    throw error;
  }
};

export const updateLine = async (id: string, metroLine: Partial<MetroLine>): Promise<MetroLine> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, metroLine);
    return response.data;
  } catch (error) {
    console.error(`Error updating metro line with id ${id}:`, error);
    throw error;
  }
};

export const deleteLine = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting metro line with id ${id}:`, error);
    throw error;
  }
};

export const searchRoutes = async (origin: string, destination: string) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
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