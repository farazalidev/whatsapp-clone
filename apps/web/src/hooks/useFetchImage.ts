import { fetcher } from '@/utils/fetcher';
import useSwr from 'swr';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';

interface IUseFetchMediaState {
  isLoading: boolean;
  imageUrl: string | undefined;
  isError: boolean;
}

interface IUseFetchMediaArgs {
  message: MessageMediaEntity | undefined;
}

type IUseFetchImage = (args: IUseFetchMediaArgs) => IUseFetchMediaState;

const useFetchImage: IUseFetchImage = ({ message }) => {
  const fetch = async () => {
    try {
      if (message) {
        const localMedia = await mainDb.offlineMedia.get(message?.id);
        if (localMedia?.file) {
          const localMediaURL = URL.createObjectURL(localMedia.file);
          return localMediaURL;
        } else {
          const responseBlob = await fetcher(`api/file/get-attachment/${message?.path}`, undefined, 'blob', 'static');
          const newLocalMediaFile = new File([responseBlob], message?.id, { type: responseBlob?.type });
          await mainDb.offlineMedia.add({
            file: newLocalMediaFile,
            id: message?.id,
            mime: message?.mime,
            type: message?.type,
          });
          const blobUrl = URL.createObjectURL(responseBlob);
          return blobUrl;
        }
      }
      return;
    } catch (error) {
      console.log('🚀 ~ fetch ~ error:', error);
    }
  };

  const { data, error, isLoading } = useSwr(`${message?.id}`, fetch, { revalidateOnFocus: false, revalidateOnReconnect: false });
  return { imageUrl: data, isError: error, isLoading };
};

export default useFetchImage;
