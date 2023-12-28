'use client';
import { createSocket } from '@/utils/createSocket';
import { useCallback } from 'react';

const useSocket = () => {
  const getSocket = useCallback(() => createSocket(), []);
  const { isError, socket } = getSocket();

  return { socket, isError };
};

export default useSocket;
