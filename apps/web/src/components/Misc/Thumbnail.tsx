import { expectedFileTypes } from '@/global/features/filesSlice';
import useColorScheme from '@/hooks/useColorScheme';
import Image from 'next/image';
import React, { FC, } from 'react';

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

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    // dispatch({type:FilesActionType.remove_File,payload:{id}})
    console.log("removing", id);

  }

  return (
    <div
      onClick={onClick}
      style={{ height, minWidth: width }}
      className={`group relative flex place-items-center justify-center overflow-hidden border hover:cursor-pointer ${active ? ' border-whatsapp-misc-my_message_bg_dark rounded-lg border-[3px]' : 'border-[2px] border-gray-300  dark:border-gray-600'}`}
    >
      <span className="invisible absolute -bottom-[100%] z-10  h-full w-full overflow-hidden bg-gray-800 bg-opacity-50 group-hover:visible group-hover:top-0" />
      <span className='absolute top-0 right-0 w-5 h-5 z-20 border' onClick={(e) => handleRemove(e, id)}>
        {colorScheme === "light" ? <Image src={'/icons/x.svg'} fill alt='remove' /> : <Image src={'/icons/x_white.svg'} fill alt='remove' />}
      </span>
      {url ? (
        <>
          {type === 'image' ? (
            <ImageThumbnail url={url} />
          ) : type === 'video' ? (
            <VideoThumbnail url={url} />
          ) : (
            <ImageThumbnail url={url} />
          )}
        </>
      ) : (
        <GenericThumbnail />
      )}
    </div>
  );
};


interface IImageThumbnail {
  url: string

}

const ImageThumbnail: FC<IImageThumbnail> = ({ url, }) => {

  return <span><Image src={url} alt="Thumbnail" fill objectFit="cover" className='relative' />
  </span>
}

interface IVideoThumbnail {
  url: string

}

const VideoThumbnail: FC<IVideoThumbnail> = ({ url, }) => {


  return <span className="flex place-items-center justify-center">
    <Image src={url} alt="Thumbnail" fill objectFit="cover" />
    <span className="absolute top-0 flex h-full w-full place-items-center justify-center bg-black bg-opacity-30">
      <span className="relative h-5 w-5">
        <Image src={'/icons/play.svg'} alt="play" fill />
      </span>
    </span>
  </span>
}


interface IGenericThumbnail {

}

const GenericThumbnail: FC<IGenericThumbnail> = () => {


  return <span><Image src={'/icons/preview-generic.svg'} alt="Thumbnail" height={30} width={30} className='relative' />
  </span>
}
