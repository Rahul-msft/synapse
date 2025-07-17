// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: Avatar;
  createdAt: Date;
  updatedAt: Date;
  isOnline: boolean;
  lastSeen: Date;
}

// Avatar related types
export interface Avatar {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl: string;
  style: AvatarStyle;
  createdAt: Date;
}

export interface AvatarStyle {
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  hairStyle: string;
  facialHair?: string;
  accessories?: string[];
}

export interface AvatarGenerationRequest {
  userId: string;
  style?: Partial<AvatarStyle>;
  photoUrl?: string; // For photo-based generation
}

// Chat related types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
  replyToId?: string;
  attachments?: MessageAttachment[];
}

export interface Chat {
  id: string;
  participants: string[];
  name?: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: ChatMessage;
}

export interface MessageAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  FILE = 'file',
  SYSTEM = 'system'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Smart Reply types
export interface SmartReply {
  id: string;
  text: string;
  confidence: number;
  category: ReplyCategory;
}

export enum ReplyCategory {
  AGREEMENT = 'agreement',
  QUESTION = 'question',
  RESPONSE = 'response',
  GREETING = 'greeting',
  FAREWELL = 'farewell',
  EMOJI = 'emoji'
}

export interface SmartReplyRequest {
  messageHistory: ChatMessage[];
  context?: string;
  maxSuggestions?: number;
}

// TTS (Text-to-Speech) types
export interface TTSRequest {
  text: string;
  voice: TTSVoice;
  speed?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 2.0
}

export interface TTSVoice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
}

export interface TTSResponse {
  audioUrl: string;
  duration: number; // in seconds
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Real-time events
export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageEvent {
  message: ChatMessage;
}

export interface UserStatusEvent {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}