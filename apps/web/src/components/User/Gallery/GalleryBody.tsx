import { RootState } from '@/global/store';
import useFetchImage from '@/hooks/useFetchImage';
import Image from 'next/image';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';

const GalleryBody = () => {
  const { activeMediaMessage } = useSelector((state: RootState) => state.GallerySlice);


  return <div className='h-full w-full'>{
    activeMediaMessage?.messageType === 'image' || activeMediaMessage?.messageType === "svg" ? (
      <GalleryImagePreview message={activeMediaMessage} />
    ) : activeMediaMessage?.messageType === 'video' ? (
      <GalleryVideoPreview message={activeMediaMessage} />
    ) : null}</div>
};

export default GalleryBody;

interface IGalleryMediaPreview {
  message: MessageEntity | undefined;
}

const GalleryImagePreview: FC<IGalleryMediaPreview> = ({ message }) => {
  const { Me } = useSelector((state: RootState) => state.UserSlice);

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);
  const { imageUrl } = useFetchImage({ isFromMe: message?.from.user_id === Me?.user_id, me_id: Me?.user_id, message: message as any, receiver_id });

  return (
    <div className={`relative mx-auto flex h-[90%] w-[90%] place-items-center justify-center ${message?.messageType === "svg" ? "bg-gray-300" : ''}`}>
      <Image src={imageUrl as string} fill objectFit="contain" alt="image" />
    </div>
  );
};
const GalleryVideoPreview: FC<IGalleryMediaPreview> = ({ message }) => {
  const { Me } = useSelector((state: RootState) => state.UserSlice);
  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);
  const user_id = message?.from.user_id === Me?.user_id ? Me?.user_id : receiver_id;

  return (
    <div className="relative mx-auto w-full h-[90%] flex justify-center place-items-center max-w-screen-lg">
      <div className="overflow-hidden relative w-full" style={{ paddingBottom: '56.25%' }}>
        <video
          className="absolute top-0 left-0 w-full h-full"
          src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_SERVER_URL}api/file/get-attachment/${user_id}/${message?.media?.id}`}
          controls
        ></video>
      </div>
    </div>
  );
};
