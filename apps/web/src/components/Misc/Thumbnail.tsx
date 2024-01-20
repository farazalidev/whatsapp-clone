import { expectedFileTypes } from '@/global/context/reducers/filesReducer';
import useColorScheme, { IColorScheme } from '@/hooks/useColorScheme';
import Image from 'next/image';
import { FC } from 'react';

export interface ThumbnailProps {
  id: string
  url: string | undefined;
  width: number;
  height: number;
  active?: boolean;
  type: expectedFileTypes;
  onClick?: () => void;
}

export const Thumbnail: FC<ThumbnailProps> = ({ url, height, width, active, onClick, type, id }) => {
  const colorScheme = useColorScheme()

  return (
    <div
      onClick={onClick}
      style={{ height, minWidth: width }}
      className={`group relative flex place-items-center justify-center overflow-hidden border hover:cursor-pointer ${active ? ' border-whatsapp-misc-my_message_bg_dark rounded-lg border-[3px]' : 'border-[2px] border-gray-300  dark:border-gray-600'}`}
    >
      <span className="invisible absolute -bottom-[100%] z-10  h-full w-full overflow-hidden bg-gray-800 bg-opacity-50 group-hover:visible group-hover:top-0" />
      {url ? (
        <>
          {type === 'image' ? (
            <ImageThumbnail url={url} colorScheme={colorScheme} />
          ) : type === 'video' ? (
            <VideoThumbnail url={url} colorScheme={colorScheme} />
          ) : (
            <ImageThumbnail url={url} colorScheme={colorScheme} />
          )}
        </>
      ) : (
        <GenericThumbnail colorScheme={colorScheme} />
      )}
    </div>
  );
};


interface IImageThumbnail {
  url: string
  colorScheme: IColorScheme
}

const ImageThumbnail: FC<IImageThumbnail> = ({ url, colorScheme }) => {

  return <span><Image src={url} alt="Thumbnail" fill objectFit="cover" className='relative' />
    <span className='absolute top-0 right-0 z-20' ><Image src={`${colorScheme === "light" ? '/icons/x.svg' : '/icons/x_white.svg'}`} width={17} height={17} alt='remove' /></span>
  </span>
}

interface IVideoThumbnail {
  url: string
  colorScheme: IColorScheme
}

const VideoThumbnail: FC<IVideoThumbnail> = ({ url, colorScheme }) => {


  return <span className="flex place-items-center justify-center">
    <Image src={url} alt="Thumbnail" fill objectFit="cover" />
    <span className="absolute top-0 flex h-full w-full place-items-center justify-center bg-black bg-opacity-30">
      <span className="relative h-5 w-5">
        <Image src={'/icons/play.svg'} alt="play" fill />
      </span>
      <span className='absolute top-0 right-0 z-20' ><Image src={`${colorScheme === "light" ? '/icons/x.svg' : '/icons/x_white.svg'}`} width={17} height={10} alt='remove' /></span>
    </span>
  </span>
}


interface IGenericThumbnail {
  colorScheme: IColorScheme
}

const GenericThumbnail: FC<IGenericThumbnail> = ({ colorScheme }) => {


  return <span><Image src={'/icons/preview-generic.svg'} alt="Thumbnail" height={30} width={30} className='relative' />
    <span className='absolute top-0 right-0 z-20' ><Image src={`${colorScheme === "light" ? '/icons/x.svg' : '/icons/x_white.svg'}`} width={17} height={17} alt='remove' /></span>
  </span>
}
