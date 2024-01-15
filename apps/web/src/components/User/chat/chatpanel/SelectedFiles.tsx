import Image from 'next/image';
import React, { FC } from 'react';
import VideoThumbnail from './VideoThumbnail';

export type SelectedFileType = {
  id: string;
  type: 'image' | 'video';
  url: string;
};

interface ISelectedFiles {
  files: SelectedFileType[];
}

const SelectedFiles: FC<ISelectedFiles> = ({ files }) => {
  return (
    <div className="flex h-28 w-full place-items-center justify-center">
      {files.map((file) => {
        return file.type === 'image' ? (
          <Image src={file.url} height={45} width={45} alt="" />
        ) : file.type === 'video' ? (
          <VideoThumbnail videoSrc={file.url} />
        ) : null;
      })}
    </div>
  );
};

export default SelectedFiles;
