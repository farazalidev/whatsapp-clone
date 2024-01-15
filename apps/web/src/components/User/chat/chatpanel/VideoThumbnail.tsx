import { generateThumbnailFromUrl } from '@/utils/generateVideoThumbnail';
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';

interface IVideoThumbnail {
  videoSrc: string;
}

const VideoThumbnail: FC<IVideoThumbnail> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    const getThumbnail = async () => {
      const thumbnail = await generateThumbnailFromUrl(videoSrc, videoRef, canvasRef);
      if (thumbnail) setThumbnail(thumbnail);
    };
    getThumbnail();
  }, [videoSrc]);

  return (
    <div>
      <Image src={thumbnail ? thumbnail : ''} alt="" height={45} width={25} />
      <video src={videoSrc} className="hidden" ref={videoRef} />
      <canvas className="hidden" ref={canvasRef} width={500} height={500} />
    </div>
  );
};

export default VideoThumbnail;
