import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { Mutation, fetcher } from './fetcher';
import { splitFileIntoChunks } from './splitFileIntoChunks';
import { extname } from 'path';

export type IProgressCallback = (progress: number, totalChunks: number, chunksUploaded: number) => void;

export const resumableUpload = async (file: SelectedFileType, lastChunk: number, progressCallback: IProgressCallback) => {
  const { chunks, totalChunks } = splitFileIntoChunks(file.file, lastChunk);

  // if the message type is vide then we will save its thumbnail first
  console.log(file);

  if (file.type === 'video') {
    const isThumbnailExisted = await fetcher<boolean>(`api/file/is-attachment-existed/${file.id}-thumbnail/.png`, undefined, 'json', 'static');
    console.log('🚀 ~ resumableUpload ~ isThumbnailExisted:', isThumbnailExisted);
    if (!isThumbnailExisted) {
      if (file.thumbnail) {
        const fmData = new FormData();
        fmData.append('attachment-thumbnail', file.thumbnail);
        const response = await Mutation('api/file/upload-attachment-thumbnail', fmData, 'static', {
          headers: {
            file_name: file.id,
            ext: '.png',
          },
        });
        console.log('response', response);
      }
    }
  }

  // uploading each chunk
  for (let i = 0; i < totalChunks; i++) {
    console.log('chunkNumber', i);
    console.log('totalChunks', totalChunks);

    const fmData = new FormData();
    fmData.append('attachment-chunk', chunks[i]);

    try {
      await Mutation('api/file/chunk-upload', fmData, 'static', {
        headers: {
          chunk_number: i.toString(),
          total_chunks: totalChunks.toString(),
          file_id: file.id,
          ext: extname(file.file.name),
        },
      });

      const progress = ((i + 1) / totalChunks) * 100;
      progressCallback(progress, totalChunks, i);

      console.log(`Chunk ${i + 1}/${totalChunks} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading chunk:', error);
    }
  }
};
