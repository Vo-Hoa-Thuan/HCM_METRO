
import axios from "axios";

const API_URL = "http://localhost:5000/news";

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


// Add token to request if available
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

export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishedDate: string;
  image?: string;
  tags: string[];
  category: string;
  isPublished: boolean;
}

export const getAllNews = async (params = {}) => {
  try {
    const response = await api.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getNewsById = async (id: string) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw error;
  }
};

export const getNewsByCategory = async (category: string) => {
  try {
    const response = await api.get('/', { params: { category } });
    return response.data;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
};

// Added missing functions
export const createNews = async (newsData: Omit<NewsItem, '_id' | 'publishedDate' | 'isPublished'>) => {
  try {
    const response = await api.post('/', newsData);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async ({ id, ...newsData }: { id: string } & Partial<NewsItem>) => {
  try {
    const response = await api.put(`/${id}`, newsData);
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};
