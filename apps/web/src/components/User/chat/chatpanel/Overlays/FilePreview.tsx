import { fileToPreviewType } from '@/global/context/reducers/filesReducer';
import Image from 'next/image';
import React, { FC } from 'react';

interface IFilePreview extends fileToPreviewType {}

const FilePreview: FC<IFilePreview> = ({ type, url, name }) => {
  return (
    <div className={`mx-auto flex h-full w-full place-items-center justify-center `}>
      {type ? (
        <>
          {type === 'image' ? (
            <div className="relative flex h-64 w-60">
              <Image src={url ? url : '/icons/preview-generic.svg'} objectFit="cover" fill alt={name ? name : 'Preview Thumbnail'} />
            </div>
          ) : type === 'video' ? (
            <video src={url} autoPlay controls />
          ) : type === 'pdf' ? (
            <>
              <Image src={'/icons/preview-generic.svg'} height={80} width={45} alt="File" />
            </>
          ) : (
            <>
              <Image src={'/icons/preview-generic.svg'} height={80} width={45} alt="File" />
            </>
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
