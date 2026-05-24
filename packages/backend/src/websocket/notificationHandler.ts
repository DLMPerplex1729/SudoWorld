import { Socket, Server as SocketIOServer } from 'socket.io';

export const initNotificationHandler = (socket: Socket, io: SocketIOServer) => {
  /**
   * User joins notification room
   */
  socket.on('notifications:subscribe', (data) => {
    const { userId } = data;
    socket.join(`user:${userId}`);
    console.log(`[Notifications] User ${userId} subscribed to notifications`);
  });

  /**
   * User marks notification as read
   */
  socket.on('notifications:mark-read', (data) => {
    const { notificationId } = data;
    console.log(`[Notifications] Notification ${notificationId} marked as read`);

    // TODO: Update notification read status
  });
};
