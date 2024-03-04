import { removeFile } from '@/global/features/filesSlice';
import useColorScheme from '@/hooks/useColorScheme';
import Image from 'next/image';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { expectedFileTypes } from '@shared/types';

export interface ThumbnailProps {
  id: string;
  url: string | Blob | undefined;
  width: number;
  height: number;
  active?: boolean;
  type: expectedFileTypes;
  onClick?: () => void;
}

export const Thumbnail: FC<ThumbnailProps> = ({ url, height, width, active, onClick, type, id }) => {
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeFile({ id }));
  };

  return (
    <div
      onClick={onClick}
      style={{ height, minWidth: width }}
      className={`group relative flex place-items-center justify-center overflow-hidden border hover:cursor-pointer ${active ? ' border-whatsapp-misc-my_message_bg_dark rounded-lg border-[3px]' : 'rounded-md border-[1px] border-gray-500  dark:border-gray-600'}`}
    >
      <span className="invisible absolute -bottom-[100%] z-10  h-full w-full overflow-hidden bg-gray-600 bg-opacity-50 group-hover:visible group-hover:top-0" />
      <span className="group invisible absolute right-0 top-0 z-20 h-5 w-5 group-hover:visible" onClick={(e) => handleRemove(e, id)}>
        {colorScheme === 'dark' ? <Image src={'/icons/x.svg'} fill alt="remove" /> : <Image src={'/icons/x_white.svg'} fill alt="remove" />}
      </span>
      {url ? (
        <>
          {type === 'image' ? (
            <ImageThumbnail url={url as string} />
          ) : type === 'video' ? (
            <VideoThumbnail url={url as string} />
            ) : (
            <ImageThumbnail url={url as string} />
          )}
        </>
      ) : type === 'pdf' ? (
        <GenericPDFThumbnail />
      ) : (
        <GenericThumbnail />
      )}
    </div>
  );
};

interface IImageThumbnail {
  url: string;
}

const ImageThumbnail: FC<IImageThumbnail> = ({ url }) => {
  return (
    <span>
      <Image src={url} alt="Thumbnail" fill objectFit="cover" className="relative" />
    </span>
  );
};

interface IVideoThumbnail {
  url: string | Blob;
}

const VideoThumbnail: FC<IVideoThumbnail> = ({ url }) => {
  let thumbnailUrl = url;
  if (url instanceof Blob) {
    thumbnailUrl = URL.createObjectURL(url);
  }

  return (
    <span className="flex place-items-center justify-center">
      <Image src={thumbnailUrl as string} alt="Thumbnail" fill objectFit="cover" />
      <span className="absolute top-0 flex h-full w-full place-items-center justify-center bg-black bg-opacity-30">
        <span className="relative h-5 w-5">
          <Image src={'/icons/play.svg'} alt="play" fill />
        </span>
      </span>
    </span>
  );
};

interface IGenericThumbnail { }

const GenericThumbnail: FC<IGenericThumbnail> = () => {
  return (
    <span>
      <Image src={'/icons/preview-generic.svg'} alt="Thumbnail" height={30} width={30} className="relative" />
    </span>
  );
};

const GenericPDFThumbnail: FC<IGenericThumbnail> = () => {
  return (
    <span>
      <Image src={'/icons/generic-pdf.svg'} alt="Thumbnail" height={30} width={30} className="relative" />
    </span>
  );
};
