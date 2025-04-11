import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/tickets";


export interface Tickets {
  _id: string;
  category: 'luot' | 'ngay' | 'tuan' |'thang' | 'khu hoi' | 'nhom';
  sub_type: 'thuong' | 'vip' | 'sinhvien' | 'nguoi_cao_tuoi';
  name: string;
  description?: string;
  price: number;
  trip_limit?: number;
  discount_percent: number;
  restrictions?: string;
  availableFrom?: string; 
  availableUntil?: string; 
  status: 'active' | 'inactive';
  validityPeriod?: number; 
}

 
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(price);
};

export const getTickets = async (): Promise<(Tickets & { validityPeriod?: number })[]> => {
  try {
    const response = await axios.get(`${API_URL}/get`);
    const tickets = response.data;

    const ticketsWithValidity = tickets.map((ticket: Tickets) => {
      const availableFrom = ticket.availableFrom ? new Date(ticket.availableFrom) : null;
      const availableUntil = ticket.availableUntil ? new Date(ticket.availableUntil) : null;
      let validityPeriod = null;

      if (availableFrom && availableUntil) {
        const diffTime = Math.abs(availableUntil.getTime() - availableFrom.getTime());
        validityPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      }

      return {
        ...ticket,
        validityPeriod, 
      };
    });

    return ticketsWithValidity;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (ticketData: Tickets) => {
    try {
      const response = await axios.post(`${API_URL}/create`, ticketData);
      return response.data;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  };
  
  // Get a single ticket by ID
  export const getTicketById = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Get tickets by type
  export const getTicketsByType = async (type: string) => {
    try {
      const response = await axios.get(`${API_URL}/type/${type}`, {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tickets by type:", error);
      throw error;
    }
  };

  // Get ticket types 
  export const getTicketTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/types`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      throw error;
    }
  };

  // Update a ticket by ID
  export const updateTicket = async (id: string, updatedData: Tickets) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket with ID ${id}:`, error);
      throw error;
    }
  };
  
  // Delete a ticket by ID
  export const deleteTicket = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket with ID ${id}:`, error);
      throw error;
    }
  };