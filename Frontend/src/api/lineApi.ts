import axios from "axios";

const API_URL = "http://localhost:5000/lines"; 

export interface MetroLine {
  _id: string; 
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
  status: "operational" | "construction" | "planned" | "closed"; 
  openingDate: string;
  length: number;
  alerts?: {
    type: "delay" | "closure" | "maintenance" | "info"; 
    message: string; 
    startDate: string; 
    endDate: string; 
    active: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export const getAllLines = async (): Promise<MetroLine[]> => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
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
