import { isVideo } from './isVideo';

type IGetSnapShotArguments = {
  videoUrl: string;
  height: number;
  width: number;
  snapShotAtTime: number;
};
type IGetSnapShot = (args: IGetSnapShotArguments) => Promise<{ snapShot: string | undefined; error: boolean }>;

export const getSnapShotOfVideo: IGetSnapShot = async ({ height, videoUrl, width, snapShotAtTime }) => {
  const video = document.createElement('video');
  video.src = videoUrl;
  const canvas = document.createElement('canvas');

  canvas.height = height;
  canvas.width = width;

  const { error } = await isVideo(videoUrl);

  if (error) {
    return { snapShot: undefined, error: true };
  }
  const getSnapShot = () => {
    canvas.getContext('2d')?.drawImage(video, 0, 0, width, height);
    const thumbnail = canvas.toDataURL('image/png');
    return thumbnail;
  };

  if (!video.currentTime || video.currentTime < snapShotAtTime) {
    video.currentTime = snapShotAtTime;
  }
  const snapShot = getSnapShot();
  video.remove();
  canvas.remove();
  return { error: false, snapShot };
};
