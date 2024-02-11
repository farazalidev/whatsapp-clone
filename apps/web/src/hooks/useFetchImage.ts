import { fetcher } from '@/utils/fetcher';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useSwr from 'swr';

interface IUseFetchMediaState {
  isLoading: boolean;
  imageUrl: string | undefined;
  isError: boolean;
}

interface IUseFetchMediaArgs {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
  receiver_id: string | undefined;
  me_id: string | undefined;
}

type IUseFetchImage = (args: IUseFetchMediaArgs) => IUseFetchMediaState;

const useFetchImage: IUseFetchImage = ({ message, isFromMe, receiver_id, me_id }) => {
  const fetch = async () => {
    const user_id = isFromMe ? me_id : receiver_id;
    const responseBlob = await fetcher(`api/file/get-attachment/${user_id}/${message?.media?.id}`, undefined, 'blob', 'static');
    const blobUrl = URL.createObjectURL(responseBlob);
    console.log('🚀 ~ fetch ~ blobUrl:', blobUrl);
    return blobUrl;
  };

  fetch();
  const { data, error, isLoading } = useSwr(`${message?.media?.id}`, fetch);
  return { imageUrl: data, isError: error, isLoading };
};

export default useFetchImage;
