import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { IFiles } from '@/global/context/reducers/filesReducer';
import fileType from 'file-type';
import { getSnapShotOfVideo } from './getSnapShot';

type validateFilesAndGetThumbnailsArgs = {
  files: IFiles;
  thumbnailDimensions: { width: number; height: number };
};

type validateFilesAndGetThumbnailsType = (args: validateFilesAndGetThumbnailsArgs) => Promise<SelectedFileType[]>;
export const validateFilesAndGetThumbnails: validateFilesAndGetThumbnailsType = async ({ files, thumbnailDimensions }) => {
  const result: SelectedFileType[] = [];

  for (const file of files) {
    // if the file is video by extension based
    if (file.file.type.startsWith('video/')) {
      const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

      // if the provided video extension is video but the file is not seems to be video
      if (!actualType?.mime.startsWith('video/')) {
        result.push({ thumbnailUrl: undefined, type: 'others', file: file.file, url: undefined, id: file.id });
      }
      // if the file actual type and extension matched
      else {
        const videoUrl = URL.createObjectURL(file.file);
        const videoThumbnail = await getSnapShotOfVideo(videoUrl, 15, 60, 60);
        result.push({ file: file.file, thumbnailUrl: videoThumbnail, type: 'video', url: videoUrl, id: file.id });
      }
    }

    // if the provided file extension is image
    else if (file.file.type.startsWith('image/') && !file.file.type.startsWith('image/svg')) {
      const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

      // if the image is not actually an image
      if (!actualType?.mime.startsWith('image/')) {
        result.push({ file: file.file, thumbnailUrl: undefined, type: 'others', url: undefined, id: file.id });
      }
      // if the file ext matched
      else {
        const url = URL.createObjectURL(file.file);
        result.push({ file: file.file, thumbnailUrl: url, type: 'image', url, id: file.id });
      }
    }

    // if the file is an svg
    else if (file.file.type.startsWith('image/svg')) {
      const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());
      // if its not an svg
      if (!actualType?.mime.startsWith('image/svg')) {
        result.push({ file: file.file, id: file.id, thumbnailUrl: undefined, type: 'others', url: undefined });
      }
      // if the file ext matched
      else {
        const url = URL.createObjectURL(file.file);
        result.push({ file: file.file, id: file.id, thumbnailUrl: url, type: 'svg', url });
      }
    }

    // if the provided file is an pdf file
    else if (file.file.type.startsWith('application/pdf') || file.file.type.startsWith('pdf/')) {
      const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

      // if the file is not actually a pdf file
      if (!actualType?.mime.startsWith('application/pdf')) {
        result.push({ file: file.file, thumbnailUrl: undefined, type: 'others', url: undefined, id: file.id });
      }
      // if the file ext matched
      else {
        result.push({ file: file.file, thumbnailUrl: undefined, type: 'pdf', url: undefined, id: file.id });
      }
    }

    // if none of the recognized types, handle as 'others'
    else {
      result.push({ file: file.file, thumbnailUrl: undefined, type: 'others', url: undefined, id: file.id });
    }
  }
  return result;
};
