import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@synapse/shared';

export function setupSocketHandlers(io: Server) {
  console.log('🔌 Setting up Socket.IO handlers');

  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Handle user joining a chat room
    socket.on(SOCKET_EVENTS.JOIN_CHAT, (chatId: string) => {
      socket.join(`chat_${chatId}`);
      console.log(`👥 User ${socket.id} joined chat: ${chatId}`);
      
      // Notify other users in the chat about the new participant
      socket.to(`chat_${chatId}`).emit(SOCKET_EVENTS.USER_ONLINE, {
        userId: socket.id, // In real implementation, this would be actual user ID
        timestamp: new Date()
      });
    });

    // Handle user leaving a chat room
    socket.on(SOCKET_EVENTS.LEAVE_CHAT, (chatId: string) => {
      socket.leave(`chat_${chatId}`);
      console.log(`👋 User ${socket.id} left chat: ${chatId}`);
      
      // Notify other users in the chat about the departure
      socket.to(`chat_${chatId}`).emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId: socket.id,
        timestamp: new Date()
      });
    });

    // Handle message sending
    socket.on(SOCKET_EVENTS.MESSAGE_SENT, (data) => {
      const { chatId, message } = data;
      console.log(`💬 Message sent in chat ${chatId}: ${message.content}`);
      
      // Broadcast message to all users in the chat except sender
      socket.to(`chat_${chatId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
        message,
        timestamp: new Date()
      });
      
      // TODO: In real implementation, save message to database here
    });

    // Handle typing indicators
    socket.on(SOCKET_EVENTS.TYPING_START, (data) => {
      const { chatId, userId } = data;
      console.log(`⌨️ User ${userId} started typing in chat ${chatId}`);
      
      socket.to(`chat_${chatId}`).emit(SOCKET_EVENTS.TYPING_START, {
        chatId,
        userId,
        timestamp: new Date()
      });
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
      const { chatId, userId } = data;
      console.log(`⌨️ User ${userId} stopped typing in chat ${chatId}`);
      
      socket.to(`chat_${chatId}`).emit(SOCKET_EVENTS.TYPING_STOP, {
        chatId,
        userId,
        timestamp: new Date()
      });
    });

    // Handle user status updates
    socket.on('update_status', (data) => {
      const { isOnline } = data;
      console.log(`🟢 User ${socket.id} status update: ${isOnline ? 'online' : 'offline'}`);
      
      // Broadcast status update to all connected users
      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
        userId: socket.id,
        isOnline,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
      
      // Notify all users about the disconnection
      socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId: socket.id,
        timestamp: new Date()
      });
      
      // TODO: In real implementation, update user's last seen timestamp in database
    });

    // Handle errors
    socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error(`🚨 Socket error for user ${socket.id}:`, error);
    });

    // Send welcome message to newly connected user
    socket.emit('welcome', {
      message: 'Connected to Synapse MVP',
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Log server-level events
  io.engine.on('connection_error', (err) => {
    console.error('🚨 Socket.IO connection error:', err.req, err.code, err.message, err.context);
  });

  console.log('✅ Socket.IO handlers configured');
}

// Utility function to emit message to specific chat
export function emitToChatRoom(io: Server, chatId: string, event: string, data: any) {
  io.to(`chat_${chatId}`).emit(event, {
    ...data,
    timestamp: new Date()
  });
}

// Utility function to emit message to specific user
export function emitToUser(io: Server, socketId: string, event: string, data: any) {
  io.to(socketId).emit(event, {
    ...data,
    timestamp: new Date()
  });
}

// Utility function to broadcast to all connected users
export function broadcastToAll(io: Server, event: string, data: any) {
  io.emit(event, {
    ...data,
    timestamp: new Date()
  });
}