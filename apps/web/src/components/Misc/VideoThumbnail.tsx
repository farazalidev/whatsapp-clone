import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Thumbnail, ThumbnailProps } from './Thumbnail';
import { isVideo } from '@/utils/isVideo';

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
  error: boolean;
}

const VideoThumbnail: FC<IVideoThumbnail> = ({ snapShotAtTime, width, height, videoUrl, active, type, onClick }) => {
  const [state, setState] = useState<VideoThumbnailState>({
    dataLoaded: false,
    metadataLoaded: false,
    seeked: false,
    snapShot: null,
    suspended: false,
    error: false,
  });
  console.log('🚀 ~ state:', state);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!state.snapShot) {
      const getSnapShot = async () => {
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          const { error } = await isVideo(videoUrl);

          if (video && !error) {
            canvas?.getContext('2d')?.drawImage(video, 0, 0, width, height);
            const thumbnail = canvas?.toDataURL('image/png');
            setState((prev) => {
              return { ...prev, snapShot: thumbnail };
            });
          }
          setState((prev) => {
            return { ...prev, snapShot: undefined, error: true };
          });
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
  }, [state, snapShotAtTime, height, width, videoUrl]);

  if (state.snapShot === null) {
    return (
      <div>
        <span
          className={`flex h-full w-full place-items-center justify-center rounded-lg  bg-black ${active ? 'border-whatsapp-misc-my_message_bg_dark border-[3px] ' : 'border-[2px] border-gray-300 border-opacity-10 dark:border-gray-600'}`}
          style={{ width, height }}
          onClick={onClick}
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
  } else if (state.error || state.snapShot === undefined) {
    <Thumbnail url={'/icons/preview-generic.svg'} height={height} width={width} type={type} onClick={onClick} active={active} />;
  } else {
    return (
      <>
        <Thumbnail url={state.snapShot} height={height} width={width} type={type} onClick={onClick} active={active} />
      </>
    );
  }
};

export default VideoThumbnail;
