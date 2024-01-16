import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

interface IVideoThumbnail extends Omit<ThumbnailProps, 'url'> {
  videoUrl: string | undefined;
  snapShotAtTime: number;
}

interface VideoThumbnailState {
  seeked: boolean;
  metadataLoaded: boolean;
  dataLoaded: boolean;
  suspended: boolean;
  snapShot: string | null | undefined;
}

const VideoThumbnail: FC<IVideoThumbnail> = ({ snapShotAtTime, width, height, videoUrl, active, type, onClick }) => {
  console.log('🚀 ~ videoUrl:', videoUrl);
  const [state, setState] = useState<VideoThumbnailState>({ dataLoaded: false, metadataLoaded: false, seeked: false, snapShot: null, suspended: false });
  console.log('🚀 ~ state:', state);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!state.snapShot) {
      const getSnapShot = () => {
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          console.log(canvas?.height, canvas?.width);

          if (video) {
            canvas?.getContext('2d')?.drawImage(video, 0, 0, width, height);
            const thumbnail = canvas?.toDataURL('image/png');
            setState((prev) => {
              return { ...prev, snapShot: thumbnail };
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      const { metadataLoaded, dataLoaded, suspended, seeked, snapShot } = state;
      if (metadataLoaded && dataLoaded && suspended && videoRef.current) {
        if (!videoRef.current?.currentTime || videoRef.current.currentTime < snapShotAtTime) {
          videoRef.current.currentTime = snapShotAtTime;
        }
        if (seeked && !snapShot) {
          getSnapShot();
        }
      }
    }
  }, [state, snapShotAtTime, height, width]);

  if (!state.snapShot) {
    return (
      <div>
        <span
          className={`flex h-full w-full place-items-center justify-center rounded-lg  bg-black ${active ? 'border-whatsapp-misc-my_message_bg_dark border-[3px] ' : 'border-[2px] border-gray-300 border-opacity-10 dark:border-gray-600'}`}
          style={{ width, height }}
        >
          <span>
            <Image src={'/icons/spinner.svg'} height={30} width={30} alt="loading..." />
          </span>
        </span>

        <canvas ref={canvasRef} height={height} width={width} className="hidden"></canvas>
        <video
          src={videoUrl}
          ref={videoRef}
          onLoadedMetadata={() =>
            setState((prev) => {
              return { ...prev, metadataLoaded: true };
            })
          }
          onLoadedData={() =>
            setState((prev) => {
              return { ...prev, dataLoaded: true };
            })
          }
          onSuspend={() =>
            setState((prev) => {
              return { ...prev, suspended: true };
            })
          }
          onSeeked={() =>
            setState((prev) => {
              return { ...prev, seeked: true };
            })
          }
          className="hidden"
        ></video>
      </div>
    );
  } else {
    return (
      <>
        <Thumbnail url={state.snapShot} height={height} width={width} type={type} onClick={onClick} active={active} />
      </>
    );
  }
};

export default VideoThumbnail;
