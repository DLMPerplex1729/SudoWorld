import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useWebSocket = () => {
  const connect = useCallback(() => {
    if (!socket) {
      socket = io(API_URL, {
        auth: {
          token: localStorage.getItem('token')
        }
      });
    }
    return socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, []);

  return { connect, disconnect, emit, on, socket }
};
