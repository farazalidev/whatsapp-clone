import { expectedFileTypes, fileToPreviewType } from '@/global/context/reducers/filesReducer';
import { convertFileSizeFromBytes } from '@/utils/getFIleSizeFromBytes';
import Image from 'next/image';
import React, { FC } from 'react';

interface IFilePreview extends fileToPreviewType {}

const FilePreview: FC<IFilePreview> = ({ type, url, name, size }) => {
  return (
    <div className={`mx-auto flex h-full w-full place-items-center justify-center `}>
      {type ? (
        <>
          {type === 'image' ? (
            <ImagePreview name={name as string} size={size} url={url as string} />
          ) : type === 'video' ? (
            <>
              <video src={url} autoPlay controls />
              {size}
            </>
          ) : type === 'pdf' ? (
            <GenericFilePreview name={name as string} size={size} />
          ) : (
            <GenericFilePreview name={name as string} size={size} />
          )}
        </>
      ) : (
        <>
          <span className="wi-full text-whatsapp-light-text dark:text-whatsapp-dark-text flex h-full place-items-center justify-center">
            Select a File to Preview
          </span>
        </>
      )}
    </div>
  );
};

export default FilePreview;

interface IGenericFilePreview {
  name: string;
  size: number;
}

const GenericFilePreview: FC<IGenericFilePreview> = ({ name, size }) => {
  return (
    <div className="relative flex h-64 w-60 flex-col place-items-center justify-center  gap-2 border border-gray-300 dark:border-gray-600">
      <Image src={'/icons/preview-generic.svg'} height={120} width={80} alt="File" />
      <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{convertFileSizeFromBytes(size)}</span>
    </div>
  );
};

interface IImagePreview {
  name: string;
  size: number;
  url: string;
}

const ImagePreview: FC<IImagePreview> = ({ name, size, url }) => {
  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="relative flex h-64 w-60 flex-col justify-center gap-2">
        <Image src={url ? url : '/icons/preview-generic.svg'} objectFit="cover" fill alt={name ? name : 'Preview Thumbnail'} />
      </div>
      <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text flex place-items-center justify-center">
        <span className="flex place-items-center justify-center">{convertFileSizeFromBytes(size)}</span>
      </span>
    </div>
  );
};
