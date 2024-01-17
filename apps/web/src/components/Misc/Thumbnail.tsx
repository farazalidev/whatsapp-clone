import { expectedFileTypes } from '@/global/context/reducers/filesReducer';
import Image from 'next/image';
import { FC } from 'react';

export interface ThumbnailProps {
  url: string | undefined;
  width: number;
  height: number;
  active?: boolean;
  type: expectedFileTypes;
  onClick?: () => void;
}

export const Thumbnail: FC<ThumbnailProps> = ({ url, height, width, active, onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{ height, width }}
      className={`group relative flex place-items-center justify-center overflow-hidden border hover:cursor-pointer ${active ? ' border-whatsapp-misc-my_message_bg_dark rounded-lg border-[3px]' : 'border-[2px] border-gray-300  dark:border-gray-600'}`}
    >
      <span className="invisible absolute -bottom-[100%] z-10  h-full w-full overflow-hidden bg-gray-800 bg-opacity-50 group-hover:visible group-hover:top-0" />
      {url ? <Image src={url} alt="Thumbnail" fill objectFit="cover" /> : <Image src={'/icons/preview-generic.svg'} alt="Thumbnail" height={35} width={35} />}
    </span>
  );
};
