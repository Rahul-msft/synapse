import axios from 'axios';
import {
  Chat,
  ChatMessage,
  SmartReplyRequest,
  SmartReply,
  Avatar,
  AvatarGenerationRequest,
  ApiResponse,
  createApiResponse
} from '@synapse/shared';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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

// Auth API functions (for future implementation)
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

// Utility function to handle file uploads
export const uploadFile = async (file: File, endpoint: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

export default api;