
import axios from "axios";

const API_URL = "http://localhost:5000/progress";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Milestone {
  progress: number;
  title: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

export interface ProgressUpdate {
  title: string;
  date: string;
  description: string;
  percentageChange: number;
}

export interface ProgressItem {
  _id: string;
  title: string;
  description: string;
  lineId: string;
  startDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  completionPercentage: number;
  location: string;
  images: string[];
  milestones: Milestone[];
  updates: ProgressUpdate[];
  createdAt: string;
  updatedAt: string;
  lineInfo?: {
    name: string;
    color: string;
  };
}

export interface LineProgressStats {
  lineId: string;
  lineName: string;
  lineColor: string;
  completionPercentage: number;
  length: number;
  completedLength: number;
  status: string;
}

export interface OverallProgressStats {
  totalLines: number;
  completedLines: number;
  totalLength: number;
  completedLength: number;
  overallCompletion: number;
}

export interface ProgressStats {
  overallStats: OverallProgressStats;
  lineStats: LineProgressStats[];
}

export const getAllProgress = async (params = {}) => {
  try {
    const response = await api.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    throw error;
  }
};

export const getProgressById = async (id: string) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress report:', error);
    throw error;
  }
};

export const createProgress = async (data: Partial<ProgressItem>) => {
  try {
    const response = await api.post('/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating progress report:', error);
    throw error;
  }
};

export const updateProgress = async (id: string, data: Partial<ProgressItem>) => {
  try {
    const response = await api.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating progress report:', error);
    throw error;
  }
};

export const deleteProgress = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting progress report:', error);
    throw error;
  }
};

export const getProgressStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data as ProgressStats;
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    throw error;
  }
};
