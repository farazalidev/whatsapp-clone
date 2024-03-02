import { RootState } from '@/global/store';
import useFetchImage from '@/hooks/useFetchImage';
import Image from 'next/image';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';

const GalleryBody = () => {
  const { activeMediaMessage } = useSelector((state: RootState) => state.GallerySlice);
  console.log("🚀 ~ GalleryBody ~ activeMediaMessage:", activeMediaMessage)


  return <div className='h-full w-full'>{
    activeMediaMessage?.type === 'image' || activeMediaMessage?.type === "svg" ? (
      <GalleryImagePreview message={activeMediaMessage} />
    ) : activeMediaMessage?.type === 'video' ? (
      <GalleryVideoPreview message={activeMediaMessage} />
    ) : null}</div>
};

export default GalleryBody;

interface IGalleryMediaPreview {
  message: MessageMediaEntity | undefined;
}

const GalleryImagePreview: FC<IGalleryMediaPreview> = ({ message }) => {

  const { imageUrl } = useFetchImage({ message });

  return (
    <div className={`relative mx-auto flex h-[90%] w-[90%] place-items-center justify-center ${message?.type === "svg" ? `bg-transparent_bg` : ''}`}>
      <Image src={imageUrl as string} fill objectFit="contain" alt="image" />
    </div>
  );
};
const GalleryVideoPreview: FC<IGalleryMediaPreview> = ({ message }) => {
  console.log("🚀 ~ message:", message)

  return (
    <div className="relative mx-auto w-full h-[90%] flex justify-center place-items-center max-w-screen-lg">
      <div className="overflow-hidden relative w-full" style={{ paddingBottom: '56.25%' }}>
        <video
          className="absolute top-0 left-0 w-full h-full"
          src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_SERVER_URL}api/file/get-attachment/${message?.path}`}
          controls
        ></video>
      </div>
    </div>
  );
};
