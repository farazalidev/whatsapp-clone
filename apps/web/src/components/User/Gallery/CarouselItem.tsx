import React, { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useDispatch } from 'react-redux';
import { MessageEntityGalleryExtended, setActiveGalleryMedia } from '@/global/features/GallerySlice';

interface ICarousalItemProps {
  data: MessageEntityGalleryExtended | null;
  url: string;
  active: boolean;
}

const CarouselItem: FC<ICarousalItemProps> = ({ active = false, url, data }) => {
  const dispatch = useDispatch();

  const handleActiveMedia = (message: MessageEntityGalleryExtended | undefined | null) => {
    if (message) {
      console.log("🚀 ~ handleActiveMedia ~ message:", message)
      dispatch(setActiveGalleryMedia(message));
    }
  };

  return (
    <div
      className={cn([
        'border-whatsapp-light-secondary_bg box-content relative max-h-[70px] max-w-[70px] h-[60px] w-[60px] dark:border-whatsapp-dark-secondary_bg flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-[5px] bg-gray-50 text-white transition-all',
        active ? 'border-gray-700 dark:border-white h-[65px] w-[65px]' : '',
        'hover:border-gray-400',
        data?.type === "svg" ? 'bg-transparent_bg bg-cover' : ''
      ])}
      onClick={() => handleActiveMedia(data)}
    >
      <Image src={url || '/placeholders/placholder-image.png'} fill objectFit="contain" alt="thumbnail" className='overflow-hidden' />
    </div>
  );
};

export default CarouselItem;
