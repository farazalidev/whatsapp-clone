import { RootState } from '@/global/store';
import { fetcher } from '@/utils/fetcher';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type IUseFetchMediaArgs = { message: MessageEntity | undefined; isFromMe: boolean | undefined };

type IUseFetchMediaState = { thumbnail: string | undefined; isLoading: boolean; error: boolean };

export type IUseFetchMediaThumbnail = (args: IUseFetchMediaArgs) => { thumbnailState: IUseFetchMediaState };

export const useFetchMediaThumbnail: IUseFetchMediaThumbnail = ({ message, isFromMe }) => {
  const [thumbnailState, setThumbnailState] = useState<IUseFetchMediaState>({ isLoading: true, thumbnail: undefined, error: false });

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);
  const { Me } = useSelector((state: RootState) => state.UserSlice);

  useEffect(() => {
    const fetchThumbnail = async () => {
      // if message is video then

      const user_id = isFromMe ? Me?.user_id : receiver_id;

      if (message?.messageType === 'video' || message?.messageType === 'image') {
        try {
          const ext = message.messageType === 'video' ? '.png' : message.media?.ext;
          const path = `${message.media?.id}`;
          const responseBlob = await fetcher(`api/file/get-attachment-thumbnail/${user_id}/${path}/sm`, undefined, 'blob', 'static', { ext });
          const thumbnail = URL.createObjectURL(responseBlob);
          setThumbnailState((prev) => {
            return { ...prev, thumbnail };
          });
        } catch (error) {
          setThumbnailState((prev) => {
            return { ...prev, isLoading: false, error: true };
          });
        } finally {
          setThumbnailState((prev) => {
            return { ...prev, isLoading: false };
          });
        }
      }
    };

    fetchThumbnail();
  }, [message, Me?.user_id, isFromMe, receiver_id]);

  return { thumbnailState };
};
