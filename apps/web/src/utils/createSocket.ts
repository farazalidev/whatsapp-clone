'use client';
import axios from 'axios';
import { Socket, io } from 'socket.io-client';
import { getCookie } from './getCookie';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types';

export const createSocket = () => {
  let isError;
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    auth: { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) },
  });

  socket.on('connect_error', async (err) => {
    if (err.message === 'Forbidden') {
      try {
        await axios.get('http://localhost:8000/auth/refresh', { withCredentials: true });
        socket.auth = { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) };
        socket.connect();
      } catch (error) {
        isError = true;
      }
    }
  });
  return { socket, isError };
};
