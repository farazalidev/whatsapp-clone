import { useEffect, useState } from 'react';
import useSocket from './useSocket';

interface useGetUserOnlineStatus {
  user_id: string | undefined;
}

const useGetUserOnlineStatus = ({ user_id }: useGetUserOnlineStatus) => {
  const [status, setStatus] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    socket.emit(`get_user_online_status`, { user_id: user_id as string });
    socket.on(`status_user_${user_id}`, (currentStatus) => {
      setStatus(currentStatus);
    });
    return () => {
      socket.off(`status_user_${user_id}`);
    };
  }, [socket, user_id]);

  return { status };
};

export default useGetUserOnlineStatus;
