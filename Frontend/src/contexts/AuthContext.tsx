
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { login as apiLogin, register as apiRegister } from '@/api/authApi';

// Define types for our context
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is already logged in when the app loads
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        
        // Configure axios to use the token for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Use the API function if API_URL is available, otherwise use mock data
      if (API_URL) {
        const response = await apiLogin(email, password);
        
        // Save to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        setUser(response.user);
        
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng quay trở lại!",
        });
      } else {
        // Mock successful login for development without API
        if (email === 'admin@metro.com' && password === 'admin123') {
          const mockUser = {
            id: '1',
            name: 'Admin User',
            email: 'admin@metro.com'
          };
          
          const mockToken = 'mock-jwt-token';
          
          // Save to localStorage
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          setUser(mockUser);
          toast({
            title: "Đăng nhập thành công",
            description: "Chào mừng quay trở lại!",
          });
        } else {
          throw new Error('Email hoặc mật khẩu không đúng');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Use the API function if API_URL is available, otherwise use mock data
      if (API_URL) {
        const response = await apiRegister(name, email, password);
        
        // Save to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        setUser(response.user);
        
        toast({
          title: "Đăng ký thành công",
          description: "Tài khoản đã được tạo thành công!",
        });
      } else {
        // Mock successful registration for development without API
        if (email === 'admin@metro.com') {
          throw new Error('Email này đã được sử dụng');
        }
        
        const mockUser = {
          id: '2',
          name,
          email
        };
        
        const mockToken = 'mock-jwt-token-new-user';
        
        // Save to localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        toast({
          title: "Đăng ký thành công",
          description: "Tài khoản đã được tạo thành công!",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Vui lòng thử lại sau",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
