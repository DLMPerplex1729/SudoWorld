import { Socket, Server as SocketIOServer } from 'socket.io';

export const initChatHandler = (socket: Socket, io: SocketIOServer) => {
  /**
   * Send a message to a friend
   */
  socket.on('chat:send-message', (data) => {
    const { fromUserId, toUserId, message } = data;
    console.log(`[Chat] Message from ${fromUserId} to ${toUserId}`);

    // TODO: Save message to database

    // Emit to recipient
    io.to(`user:${toUserId}`).emit('chat:message-received', {
      fromUserId,
      message,
      timestamp: new Date()
    });
  });

  /**
   * Mark message as read
   */
  socket.on('chat:mark-read', (data) => {
    const { messageId } = data;
    console.log(`[Chat] Message ${messageId} marked as read`);

    // TODO: Update message read status
  });
};
