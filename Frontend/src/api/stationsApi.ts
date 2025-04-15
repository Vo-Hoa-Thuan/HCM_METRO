import axios from "axios";

const API_URL = "http://localhost:5000/stations"; 

export interface Station {
  _id: string; 
  name: string; 
  nameVi: string; 
  address: string; 
  coordinates: [number, number]; 
  lines: string[];
  facilities?: string[]; 
  dailyPassengers?: number; 
  isInterchange?: boolean; 
  isDepot?: boolean; 
  isUnderground?: boolean;
  status: "operational" | "construction" | "planned" | "closed"; 
  hasWifi?: boolean; 
  hasParking?: boolean; 
  hasTicketMachine?: boolean; 
  hasAccessibility?: boolean; 
  hasBathroom?: boolean;
  createdAt?: string; 
  updatedAt?: string; 
}

export const getAllStations = async (): Promise<Station[]> => {
    try {
      const response = await axios.get(`${API_URL}/get`);
      return response.data;
    } catch (error) {
      console.error("Error fetching stations:", error);
      throw error;
    }
  };
  
  export const getStationById = async (id: string): Promise<Station> => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching station with id ${id}:`, error);
      throw error;
    }
  };
  
  export const createStation = async (station: Station): Promise<Station>=> {
    try {
      const response = await axios.post(`${API_URL}/create`, station);
      return response.data;
    } catch (error) {
      console.error("Error creating station:", error);
      throw error;
    }
  };
  
  export const updateStation = async (id: string, station: Partial<Station>): Promise<Station> => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, station);
      return response.data;
    } catch (error) {
      console.error(`Error updating station with id ${id}:`, error);
      throw error;
    }
  };
  
  export const deleteStation = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting station with id ${id}:`, error);
      throw error;
    }
  };


