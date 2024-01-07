'use client';
import axios from 'axios';
import { Socket, io } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types';
import { getCookie } from './getCookie';

export type ISocket_Client = Socket<ServerToClientEvents, ClientToServerEvents> | null;

let socketInstance: ISocket_Client = null;
export const createSocket = () => {
  if (socketInstance) {
    return { socket: socketInstance, isError: false };
  }

  let isError;
  socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    auth: { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) },
  });

  socketInstance.on('connect_error', async (err) => {
    if (err.message === 'Forbidden') {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`, { withCredentials: true });

        if (socketInstance) {
          // Perform a null check before using socketInstance
          socketInstance.auth = { accessToken: getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME) };
          socketInstance.connect();
        }
      } catch (error) {
        isError = true;
      }
    }
  });

  return { socket: socketInstance, isError };
};
