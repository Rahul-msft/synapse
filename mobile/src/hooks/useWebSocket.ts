import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppState, AppStateStatus } from 'react-native';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  reconnectAttempts: number;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection to:', url);

    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setIsConnected(true);
      setError(null);
      setReconnectAttempts(0);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('🚨 WebSocket connection error:', err);
      setError(err);
      setReconnectAttempts(prev => prev + 1);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 WebSocket reconnected after ${attemptNumber} attempts`);
      setReconnectAttempts(0);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 WebSocket reconnection attempt ${attemptNumber}`);
      setReconnectAttempts(attemptNumber);
    });

    newSocket.on('reconnect_error', (err) => {
      console.error('🚨 WebSocket reconnection error:', err);
      setError(err);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('🚨 WebSocket reconnection failed after maximum attempts');
      setError(new Error('Failed to reconnect after maximum attempts'));
    });

    // Welcome message handler
    newSocket.on('welcome', (data) => {
      console.log('👋 Welcome message:', data);
    });

    // Generic error handler
    newSocket.on('error', (err) => {
      console.error('🚨 WebSocket error:', err);
      setError(err);
    });

    setSocket(newSocket);

    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        console.log('📱 App came to foreground, checking connection');
        if (!newSocket.connected) {
          newSocket.connect();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        console.log('📱 App went to background');
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      subscription?.remove();
      newSocket.close();
    };
  }, [url]);

  return {
    socket,
    isConnected,
    error,
    reconnectAttempts,
  };
}

// Custom hook for managing typing indicators
export function useTypingIndicator(socket: Socket | null, chatId: string, userId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatId && data.userId !== userId) {
        setTypingUsers(prev => 
          prev.includes(data.userId) ? prev : [...prev, data.userId]
        );
      }
    };

    const handleTypingStop = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatId) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    };

    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, chatId, userId]);

  const startTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing_start', { chatId, userId });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('typing_stop', { chatId, userId });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return {
    isTyping,
    typingUsers,
    startTyping,
    stopTyping,
  };
}

// Custom hook for handling online/offline status
export function useOnlineStatus(socket: Socket | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket]);

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  return {
    onlineUsers: Array.from(onlineUsers),
    isUserOnline,
  };
}