import axios from "axios";
import { ReactNode } from "react";

const API_URL = "http://localhost:5000/feedbacks";

// Interface định nghĩa dữ liệu thống kê
export interface Feedback {
  date: string | number | Date;
  rating: ReactNode;
  userEmail: any;
  userName: any;
  comment: any;
  status: string;
  response: string;
  _id: any;
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
// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


export const getAllFeedback = async (params = {}) => {
  try {
    const response = await api.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return { feedback: [], totalCount: 0 };
  }
};

export const getFeedbackById = async (id: string) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return null;
  }
};

export const submitFeedback = async (feedbackData: Omit<Feedback, 'date' | '_id' | 'status'>) => {
  try {
    const response = await api.post('/', {
      ...feedbackData,
      date: new Date().toISOString(),
      status: 'new'
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, message: 'Failed to submit feedback' };
  }
};

export const updateFeedback = async (id: string, feedbackData: Partial<Feedback>) => {
  try {
    const response = await api.put(`/${id}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error updating feedback:', error);
    return { success: false, message: 'Failed to update feedback' };
  }
};

export const deleteFeedback = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return { success: false, message: 'Failed to delete feedback' };
  }
};

export const getFeedbackStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return {
      totalCount: 0,
      averageRating: 0,
      ratingsDistribution: {},
      sourceDistribution: {},
      statusDistribution: {},
      recentTrend: []
    };
  }
};

