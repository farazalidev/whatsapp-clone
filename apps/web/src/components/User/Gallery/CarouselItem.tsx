import React, { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useDispatch } from 'react-redux';
import { MessageEntityGalleryExtended, setActiveGalleryMedia } from '@/global/features/GallerySlice';

interface ICarousalItemProps {
  data: MessageEntityGalleryExtended | null;
  user_id: string | undefined;
  url: string;
  active: boolean;
}

const CarouselItem: FC<ICarousalItemProps> = ({ active = false, url, data }) => {
  const dispatch = useDispatch();

  const handleActiveMedia = (message: MessageEntityGalleryExtended | undefined | null) => {
    if (message) {
      dispatch(setActiveGalleryMedia(message));
    }
  };

  return (
    <div
      className={cn([
        'border-whatsapp-light-secondary_bg box-content relative max-h-[60px] max-w-[60px] h-[60px] w-[60px] dark:border-whatsapp-dark-secondary_bg flex-shrink-0 flex-grow-0 cursor-pointer rounded-md border-[5px] bg-gray-50 text-white transition-all',
        active ? 'border-gray-700 dark:border-gray-300' : '',
        'hover:border-gray-300',
        data?.messageType === "svg" ? 'bg-gray-300' : ''
      ])}
      onClick={() => handleActiveMedia(data)}
    >
      <Image src={url || '/placeholders/placholder-image.png'} fill objectFit="contain" alt="thumbnail" className='overflow-hidden' />
    </div>
  );
};

export default CarouselItem;
