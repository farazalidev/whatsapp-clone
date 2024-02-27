import { RootState } from '@/global/store';
import { fetcher } from '@/utils/fetcher';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
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

      if ((message?.messageType === 'video' || message?.messageType === 'image') && message.media) {
        console.log(message);

        try {
          const localThumbnail = await mainDb.offlineMedia.get(message?.media?.id);

          if (localThumbnail?.file) {
            const url = URL.createObjectURL(localThumbnail.file);
            console.log('🚀 ~ fetchThumbnail ~ url:', url);
            setThumbnailState((prev) => {
              return { ...prev, thumbnail: url };
            });
          } else {
            const ext = message.messageType === 'video' ? '.png' : message.media?.ext;
            const path = `${message.media.path}`;
            const responseBlob = await fetcher(`api/file/get-attachment-thumbnail/${path}/sm`, undefined, 'blob', 'static', { ext });
            const mimeType = message.messageType === 'video' ? 'image/png' : message.media.mime;
            console.log('🚀 ~ fetchThumbnail ~ responseBlob:', responseBlob);
            await mainDb.offlineMedia.add({
              file: new File([responseBlob], message.media.id, { type: responseBlob.type }),
              id: message.media.id,
              mime: mimeType,
              type: 'image',
            });
            const thumbnail = URL.createObjectURL(responseBlob);
            setThumbnailState((prev) => {
              return { ...prev, thumbnail };
            });
          }
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
