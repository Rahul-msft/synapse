import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Chat,
  ChatMessage,
  SmartReplyRequest,
  SmartReply,
  Avatar,
  AvatarGenerationRequest,
  ApiResponse,
  createApiResponse,
  API_CONFIG
} from '@synapse/shared';

// Configure axios instance for mobile
const api = axios.create({
  baseURL: API_CONFIG.getBaseUrl(), // For Android emulator, use 10.0.2.2:8000 for local development
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      try {
        await AsyncStorage.removeItem('authToken');
        // TODO: Navigate to login screen
        console.log('Unauthorized: redirecting to login');
      } catch (storageError) {
        console.warn('Failed to remove auth token:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Chat API functions
export const fetchChats = async (): Promise<Chat[]> => {
  const response = await api.get('/chat');
  return response.data.data || [];
};

export const fetchChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const response = await api.get(`/chat/${chatId}/messages`);
  return response.data.data?.messages || [];
};

export const sendMessage = async (chatId: string, content: string): Promise<ChatMessage> => {
  const response = await api.post(`/chat/${chatId}/messages`, { content });
  return response.data.data;
};

// Smart Reply API functions
export const getSmartReplies = async (request: SmartReplyRequest): Promise<SmartReply[]> => {
  const response = await api.post('/smart-reply/suggestions', request);
  return response.data.data?.suggestions || [];
};

// Avatar API functions
export const fetchUserAvatars = async (userId: string): Promise<Avatar[]> => {
  const response = await api.get('/avatar', { params: { userId } });
  return response.data.data || [];
};

export const generateAvatar = async (request: AvatarGenerationRequest): Promise<Avatar> => {
  const response = await api.post('/avatar/generate', request);
  return response.data.data;
};

export const uploadAvatarPhoto = async (formData: FormData): Promise<Avatar> => {
  const response = await api.post('/avatar/upload-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteAvatar = async (avatarId: string): Promise<void> => {
  await api.delete(`/avatar/${avatarId}`);
};

// TTS API functions
export const synthesizeText = async (text: string, voiceId: string) => {
  const response = await api.post('/tts/synthesize', {
    text,
    voice: { id: voiceId },
  });
  return response.data.data;
};

export const getAvailableVoices = async () => {
  const response = await api.get('/tts/voices');
  return response.data.data || [];
};

// Auth API functions
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { user, token } = response.data.data;
  
  // Store token in AsyncStorage
  if (token) {
    await AsyncStorage.setItem('authToken', token);
  }
  
  return { user, token };
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  const { user, token } = response.data.data;
  
  // Store token in AsyncStorage
  if (token) {
    await AsyncStorage.setItem('authToken', token);
  }
  
  return { user, token };
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    // Always remove token from storage
    await AsyncStorage.removeItem('authToken');
  }
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

// Network utility functions
export const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Storage utility functions
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export default api;