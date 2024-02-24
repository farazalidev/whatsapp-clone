import Typography from '@/Atoms/Typography/Typography';
import { fileToPreviewType } from '@/global/features/filesSlice';
import { convertFileSizeFromBytes } from '@/utils/getFIleSizeFromBytes';
import Image from 'next/image';
import React, { FC } from 'react';

interface IFilePreview extends fileToPreviewType { }

const FilePreview: FC<IFilePreview> = ({ type, url, name, size, id }) => {
  return (
    <div className={`mx-auto flex h-full w-full place-items-center justify-center `}>
      {type ? (
        <>
          {type === 'image' || type === 'svg' ? (
            <ImagePreview name={name as string} size={size} url={url as string} />
          ) : type === 'video' ? (
            <VideoPreview videoUrl={url as string} size={size} />
          ) : type === 'pdf' ? (
                <PdfFileGenericPreview name={name as string} size={size} />
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
      <Typography level={4} className="text-center text-sm text-gray-700 whitespace-nowrap px-2" >
        File Preview is not available
      </Typography>
      <div>
        <Image src={'/icons/preview-generic.svg'} height={120} width={80} alt="File" />
      </div>
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
        <Image src={url ? url : '/icons/preview-generic.svg'} objectFit="contain" fill alt={name ? name : 'Preview Thumbnail'} />
      </div>
      <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text flex place-items-center justify-center">
        <span className="flex place-items-center justify-center">{convertFileSizeFromBytes(size)}</span>
      </span>
    </div>
  );
};

const VideoPreview = ({ videoUrl, size }: { videoUrl: string; size: number }) => {
  return (
    <div className="relative w-full pb-[45%] text-whatsapp-light-text dark:text-whatsapp-dark-text ">
      <iframe src={videoUrl} allowFullScreen allow='autoplay' className='absolute top-0 left-0 w-full h-full'></iframe>
    </div>
  );
};

const PdfFileGenericPreview: FC<IGenericFilePreview> = ({ name, size }) => {
  return (
    <div className="relative flex h-64 w-60 flex-col place-items-center justify-center  gap-2 border border-gray-300 dark:border-gray-600">
      <Typography level={4} className="text-center text-sm text-gray-700 whitespace-nowrap px-2" >
        File Preview is not available
      </Typography>
      <div>
        <Image src={'/icons/generic-pdf.svg'} height={120} width={80} alt="File" />
      </div>
      <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text">{convertFileSizeFromBytes(size)}</span>
    </div>
  );
};
