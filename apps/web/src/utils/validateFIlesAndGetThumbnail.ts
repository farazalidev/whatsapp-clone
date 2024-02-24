import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import fileType from 'file-type';
import { getSnapShotOfVideoBlob } from './getSnapShot';
import { isSVG } from './isSvg';
import { IFiles, filesFromType } from '@/global/features/filesSlice';
import { getImageDimensions } from './getImageDimensions';
import { calculateChecksumAwait } from './file/calculateFileChecksum';

type validateFilesAndGetThumbnailsArgs = {
  from: filesFromType | null;
  files: IFiles;
  thumbnailDimensions: { width: number; height: number };
};

type validateFilesAndGetThumbnailsType = (args: validateFilesAndGetThumbnailsArgs) => Promise<SelectedFileType[]>;
export const validateFilesAndGetThumbnails: validateFilesAndGetThumbnailsType = async ({ files, thumbnailDimensions, from }) => {
  let result: SelectedFileType[] = [];
  try {
    for (const file of files) {
      // if the file is video by extension based
      if (file.file.type.startsWith('video/')) {
        const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

        const fileChecksum = await calculateChecksumAwait(file.file);

        // if the provided video extension is video but the file is not seems to be video
        if (!actualType?.mime.startsWith('video/')) {
          result.push({
            thumbnail: undefined,
            type: 'others',
            file: file.file,
            url: undefined,
            id: file.id,
            attachedMessage: null,
            height: null,
            original_name: file.file.name,
            width: null,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
        // if the file actual type and extension matched
        else {
          const videoUrl = URL.createObjectURL(file.file);
          const { blob, height, width } = await getSnapShotOfVideoBlob(videoUrl, 15, thumbnailDimensions.height, thumbnailDimensions.width);
          result.push({
            file: file.file,
            thumbnail: blob,
            type: 'video',
            url: videoUrl,
            id: file.id,
            attachedMessage: null,
            height,
            width,
            original_name: file.file.name,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
      }

      // if the provided file extension is image
      else if (file.file.type.startsWith('image/') && !file.file.type.startsWith('image/svg')) {
        const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

        const fileChecksum = await calculateChecksumAwait(file.file);

        // if the image is not actually an image
        if (!actualType?.mime.startsWith('image/')) {
          result.push({
            file: file.file,
            thumbnail: undefined,
            type: 'others',
            url: undefined,
            id: file.id,
            attachedMessage: null,
            height: null,
            original_name: file.file.name,
            width: null,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
        // if the file ext matched
        else {
          const url = URL.createObjectURL(file.file);
          const dimensions = await getImageDimensions(url);
          result.push({
            file: file.file,
            thumbnail: url,
            type: 'image',
            url,
            id: file.id,
            attachedMessage: null,
            height: Math.round(dimensions.height),
            width: Math.round(dimensions.width),
            original_name: file.file.name,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
      }

      // if the file is an svg
      else if (file.file.type.startsWith('image/svg')) {
        const fileArrayBuffer = await file.file.arrayBuffer();

        const is = isSVG(Buffer.from(fileArrayBuffer));

        const fileChecksum = await calculateChecksumAwait(file.file);

        // if its not an svg
        if (!is) {
          result.push({
            file: file.file,
            id: file.id,
            thumbnail: undefined,
            type: 'others',
            url: undefined,
            attachedMessage: null,
            height: null,
            original_name: file.file.name,
            width: null,
            fileChecksum,
            uploadedFileSize: 0,
            mime: 'application/octet-stream',
          });
        }
        // if the file ext matched
        else {
          const url = URL.createObjectURL(file.file);
          const dimensions = await getImageDimensions(url);
          result.push({
            file: file.file,
            id: file.id,
            thumbnail: url,
            type: 'svg',
            url,
            attachedMessage: null,
            height: Math.round(dimensions.height),
            original_name: file.file.name,
            width: Math.round(dimensions.width),
            fileChecksum,
            uploadedFileSize: 0,
            mime: 'image/svg',
          });
        }
      }

      // if the provided file is an pdf file
      else if (file.file.type.startsWith('application/pdf') || file.file.type.startsWith('pdf/')) {
        const actualType = await fileType.fromBuffer(await file.file.arrayBuffer());

        const fileChecksum = await calculateChecksumAwait(file.file);

        // if the file is not actually a pdf file
        if (!actualType?.mime.startsWith('application/pdf')) {
          result.push({
            file: file.file,
            thumbnail: undefined,
            type: 'others',
            url: undefined,
            id: file.id,
            attachedMessage: null,
            height: null,
            width: null,
            original_name: file.file.name,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
        // if the file ext matched
        else {
          result.push({
            file: file.file,
            thumbnail: undefined,
            type: 'pdf',
            url: undefined,
            id: file.id,
            attachedMessage: null,
            height: null,
            width: null,
            original_name: file.file.name,
            fileChecksum,
            uploadedFileSize: 0,
            mime: actualType?.mime || 'application/octet-stream',
          });
        }
      }

      // if none of the recognized types, handle as 'others'
      else {
        const fileChecksum = await calculateChecksumAwait(file.file);

        result.push({
          file: file.file,
          thumbnail: undefined,
          type: 'others',
          url: undefined,
          id: file.id,
          attachedMessage: null,
          height: null,
          width: null,
          original_name: file.file.name,
          fileChecksum,
          uploadedFileSize: 0,
          mime: 'application/octet-stream',
        });
      }
    }
  } catch (error) {
  console.log('🚀 ~ constvalidateFilesAndGetThumbnails:validateFilesAndGetThumbnailsType= ~ error:', error);
  }

  // removing unmatched files
  // if the files are selected as video or images
  if (from === 'videos&photos') {
    result = result.filter((file) => file.type === 'image' || file.type === 'video' || file.type === 'svg');
  }

  return result;
};
