import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { Mutation, fetcher } from './fetcher';
import { splitFileIntoChunks } from './splitFileIntoChunks';
import { extname } from 'path';

export type IProgressCallback = (progress: number, totalChunks: number, chunksUploaded: number) => Promise<void>;
export type managerCallback = (manager: AbortController) => void;

export const resumableUpload = async (file: SelectedFileType, lastChunk: number | undefined, progressCallback: IProgressCallback, manager: managerCallback) => {
  const controller = new AbortController();
  manager(controller);
  const signal = controller.signal;

  const { chunks, totalChunks } = splitFileIntoChunks(file.file, lastChunk);

  // if the message type is vide then we will save its thumbnail first

  if (file.type === 'video') {
    const isThumbnailExisted = await fetcher<boolean>(`api/file/is-attachment-existed/${file.id}-thumbnail/.png`, undefined, 'json', 'static');
    if (!isThumbnailExisted) {
      if (file.thumbnail) {
        const fmData = new FormData();
        fmData.append('attachment-thumbnail', file.thumbnail);
        await Mutation('api/file/upload-attachment-thumbnail', fmData, 'static', {
          headers: {
            file_name: file.id,
            ext: '.png',
          },
        });
      }
    }
  }

  // if file size is more than 10 mb then upload it in chunks
  if (file.file.size > 10485760) {
    // uploading each chunk
    for (let i = 0; i < totalChunks; i++) {
      const fmData = new FormData();
      fmData.append('attachment-chunk', chunks[i]);
      try {
        const progress = ((i + 1) / totalChunks) * 100;
        await progressCallback(progress, totalChunks, i);

        await Mutation('api/file/chunk-upload', fmData, 'static', {
          headers: {
            chunk_number: i.toString(),
            total_chunks: totalChunks.toString(),
            file_id: file.id,
            ext: extname(file.file.name),
          },
          signal,
        });

        if (controller.signal.aborted) {
          break;
        }
      } catch (error) {
        // Handle errors if needed
        console.error('Error during chunk upload:', error);
        // Optionally, you may choose to break the loop or handle the error differently
        break;
      }
    }
    return;
  }

  // if the file size is not more than 10 mbs then upload as a single file
  const formData = new FormData();
  formData.append('attachment-file', file.file);
  await Mutation(`api/file/upload-attachment-file`, formData, 'static', { headers: { file_id: file.id, ext: extname(file.file.name) } });
};
