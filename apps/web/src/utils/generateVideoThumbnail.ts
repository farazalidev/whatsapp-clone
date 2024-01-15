import { RefObject } from 'react';

export const generateThumbnailFromUrl = (
  videoUrl: string,
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
): Promise<string | undefined> => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    const context = canvas.getContext('2d');

    video.src = videoUrl;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const url = canvas.toDataURL('image/jpeg');
        resolve(url);
      }
    };

    video.onloadeddata = () => {
      resolve(undefined);
    };
  });
};
