import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { Mutation } from './fetcher';
import { splitFileIntoChunks } from './splitFileIntoChunks';
import { extname } from 'path';

export type IProgressCallback = (progress: number, totalChunks: number, chunksUploaded: number) => void;

export const resumableUpload = async (file: SelectedFileType, lastChunk: number, progressCallback: IProgressCallback) => {
  const { chunks, totalChunks } = splitFileIntoChunks(file.file, lastChunk);

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
