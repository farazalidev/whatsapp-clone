import { fetcher } from '@/utils/fetcher';
import useSwr from 'swr';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';

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
    const responseBlob = await fetcher(`api/file/get-attachment/${message?.path}`, undefined, 'blob', 'static');
    const blobUrl = URL.createObjectURL(responseBlob);
    return blobUrl;
  };

  fetch();
  const { data, error, isLoading } = useSwr(`${message?.id}`, fetch);
  return { imageUrl: data, isError: error, isLoading };
};

export default useFetchImage;
