'use client';
import { getCookie } from '@/utils/getCookie';
import axios from 'axios';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null; isLoading: boolean; isError: boolean }>({
  isError: false,
  isLoading: true,
  socket: null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        withCredentials: true,
        auth: { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) },
        retries: 5,
        timeout: 1000,
      });

      newSocket.on('connect_error', async (err) => {
        if (err.message === 'Forbidden') {
          try {
            await axios.get('http://localhost:8000/auth/refresh', { withCredentials: true });
            newSocket.auth = { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) };
            newSocket.connect();
          } catch (error) {
            setIsError(true);
          }
        }
      });

      newSocket.on('connect', () => {
        setIsLoading(false);
        setIsError(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    socket,
    isLoading,
    isError,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
