// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },

  // Chat endpoints
  CHAT: {
    LIST: '/chat',
    CREATE: '/chat',
    GET: (id: string) => `/chat/${id}`,
    MESSAGES: (id: string) => `/chat/${id}/messages`,
    SEND_MESSAGE: (id: string) => `/chat/${id}/messages`,
    TYPING: (id: string) => `/chat/${id}/typing`
  },

  // Avatar endpoints
  AVATAR: {
    GENERATE: '/avatar/generate',
    UPLOAD_PHOTO: '/avatar/upload-photo',
    LIST: '/avatar',
    GET: (id: string) => `/avatar/${id}`,
    DELETE: (id: string) => `/avatar/${id}`
  },

  // Smart Reply endpoints
  SMART_REPLY: {
    SUGGESTIONS: '/smart-reply/suggestions'
  },

  // TTS endpoints
  TTS: {
    SYNTHESIZE: '/tts/synthesize',
    VOICES: '/tts/voices'
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_STATUS: '/user/status',
    SEARCH: '/user/search'
  }
} as const;

// WebSocket events
export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Chat events
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_UPDATED: 'message_updated',
  
  // Typing events
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // User status events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  
  // Error events
  ERROR: 'error'
} as const;

// Avatar configuration
export const AVATAR_CONFIG = {
  HAIR_COLORS: [
    '#000000', // Black
    '#654321', // Brown
    '#FFD700', // Blonde
    '#FF4500', // Red
    '#696969', // Gray
    '#FFFFFF'  // White
  ],
  
  SKIN_COLORS: [
    '#FDBCB4', // Light
    '#F1C27D', // Medium-light
    '#E0AC69', // Medium
    '#C68642', // Medium-dark
    '#8D5524', // Dark
    '#A0522D'  // Deep
  ],
  
  EYE_COLORS: [
    '#8B4513', // Brown
    '#87CEEB', // Blue
    '#90EE90', // Green
    '#708090', // Gray
    '#DDA0DD', // Hazel
    '#000000'  // Black
  ],
  
  HAIR_STYLES: [
    'short',
    'medium',
    'long',
    'curly',
    'wavy',
    'straight',
    'buzz',
    'bald'
  ],
  
  FACIAL_HAIR: [
    'none',
    'mustache',
    'beard',
    'goatee',
    'stubble'
  ],
  
  ACCESSORIES: [
    'glasses',
    'sunglasses',
    'earrings',
    'hat',
    'headband'
  ]
} as const;

// TTS configuration
export const TTS_CONFIG = {
  DEFAULT_SPEED: 1.0,
  DEFAULT_PITCH: 1.0,
  MIN_SPEED: 0.5,
  MAX_SPEED: 2.0,
  MIN_PITCH: 0.5,
  MAX_PITCH: 2.0,
  
  VOICES: [
    {
      id: 'en-us-female-1',
      name: 'Sarah',
      language: 'en-US',
      gender: 'female' as const
    },
    {
      id: 'en-us-male-1',
      name: 'David',
      language: 'en-US',
      gender: 'male' as const
    },
    {
      id: 'en-us-neutral-1',
      name: 'Alex',
      language: 'en-US',
      gender: 'neutral' as const
    }
  ]
} as const;

// Smart Reply configuration
export const SMART_REPLY_CONFIG = {
  MAX_SUGGESTIONS: 3,
  MIN_CONFIDENCE: 0.5,
  CONTEXT_WINDOW: 10, // Number of previous messages to consider
  
  COMMON_REPLIES: {
    AGREEMENT: ['Yes', 'Absolutely', 'I agree', 'Sounds good'],
    QUESTION: ['What do you think?', 'How about you?', 'Really?'],
    RESPONSE: ['Thanks', 'Got it', 'Understood', 'Perfect'],
    GREETING: ['Hello', 'Hi there', 'Good morning', 'Hey'],
    FAREWELL: ['Goodbye', 'See you later', 'Take care', 'Bye'],
    EMOJI: ['👍', '😊', '❤️', '😂', '🎉', '👏']
  }
} as const;

// UI configuration
export const UI_CONFIG = {
  CHAT: {
    MESSAGE_PAGE_SIZE: 50,
    TYPING_TIMEOUT: 3000, // ms
    MESSAGE_MAX_LENGTH: 1000,
    ATTACHMENT_MAX_SIZE: 10 * 1024 * 1024 // 10MB
  },
  
  THEME: {
    COLORS: {
      PRIMARY: '#007AFF',
      SECONDARY: '#5856D6',
      SUCCESS: '#34C759',
      WARNING: '#FF9500',
      ERROR: '#FF3B30',
      BACKGROUND: '#F2F2F7',
      SURFACE: '#FFFFFF',
      TEXT_PRIMARY: '#000000',
      TEXT_SECONDARY: '#8E8E93'
    }
  }
} as const;

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Chat errors
  CHAT_NOT_FOUND: 'CHAT_NOT_FOUND',
  MESSAGE_SEND_FAILED: 'MESSAGE_SEND_FAILED',
  
  // Avatar errors
  AVATAR_GENERATION_FAILED: 'AVATAR_GENERATION_FAILED',
  PHOTO_PROCESSING_FAILED: 'PHOTO_PROCESSING_FAILED',
  
  // TTS errors
  TTS_SYNTHESIS_FAILED: 'TTS_SYNTHESIS_FAILED',
  VOICE_NOT_AVAILABLE: 'VOICE_NOT_AVAILABLE'
} as const;