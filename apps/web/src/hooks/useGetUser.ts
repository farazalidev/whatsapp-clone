import { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/global/features/UserSlice';

const useGetUser = () => {
  const [userData, setUserData] = useState<{
    Me?: UserEntity;
    chats?: UserChatEntity[];
    contacts?: ContactEntity[];
  }>();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { socket, isError: socketIsError, isLoading: socketIsLoading } = useSocket();

  useEffect(() => {
    if (socket) {
      const fetchData = async () => {
        try {
          // Set loading to true while data is being fetched
          setIsLoading(true);
          dispatch(setUserInfo({ isLoading: true }));

          // Emit the 'get-user-data' event to request data
          socket.emit('get-user-data');

          // Use Promise.all to wait for all data to be received
          const [meData, chatsData, contactsData] = await Promise.all([
            new Promise<UserEntity>((resolve) =>
              socket.on('me', async (data) => {
                resolve(data);
                dispatch(setUserInfo({ Me: await data }));
              }),
            ),
            new Promise<UserChatEntity[]>((resolve) =>
              socket.on('chats', async (data) => {
                resolve(data);
                dispatch(setUserInfo({ chats: await data }));
              }),
            ),
            new Promise<ContactEntity[]>((resolve) =>
              socket.on('contacts', async (data) => {
                resolve(data);
                dispatch(setUserInfo({ contacts: await data }));
              }),
            ),
          ]);

          // Update the state with the received data

          setUserData({
            Me: meData,
            chats: chatsData,
            contacts: contactsData,
          });
        } catch (error) {
          // If any socket.on() encounters an error, set isError to true
          setIsError(true);
          dispatch(setUserInfo({ isError: true }));
        } finally {
          setIsLoading(false);
          dispatch(setUserInfo({ isLoading: false }));
        }
      };

      fetchData();
    }
  }, [socket, dispatch]);

  return { userData, isLoading, isError, socketIsError, socketIsLoading };
};

export default useGetUser;
