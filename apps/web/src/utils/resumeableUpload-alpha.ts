import { extname } from 'path';
import { Mutation } from './fetcher';
import { createFileChunk } from './file/createFileChunk';
import { calculateChecksumPromise } from './file/calculateFileChecksum';

type IPerformActionArgs = { chunksUploaded: number; totalChunks: number; progress: number };

export type IPerformAction = (args: IPerformActionArgs) => void | Promise<void>;

export interface ResumableUploadProps {
  file: File | null;
  file_name: string;
  startByte?: number;
  onProgress: (progress: number, isLoading: boolean) => void;
  performAction?: IPerformAction;
}

export class ResumableUpload {
  private file: File | null = null;
  private file_name: string | null;
  private isLoading: boolean = true;
  private onProgress: (progress: number, isLoading: boolean, uploadedBytes: number) => void;
  private controller: AbortController | null = null;
  private startByte: number = 0;
  private error: boolean = false;

  constructor(props: ResumableUploadProps) {
    this.file = props.file;
    this.file_name = props.file_name;
    this.onProgress = props.onProgress;
    this.startByte = props.startByte || 0;

    if (!this.controller) {
      this.controller = new AbortController();
    }
  }

  uploadChunk() {
    {
      this.isLoading = false;
      this.uploadFileIntoChunks(this.startByte);
    }
  }

  private async uploadFileIntoChunks(startByte: number) {
    if (this.file && this.file.size) {
      const fileSize = this.file.size;
      const chunk = createFileChunk(this.file, this.startByte, 1);
      const formData = new FormData();
      formData.append('attachment-chunk', chunk);
      const fileName = this.file.name;

      calculateChecksumPromise(chunk)
        .then((checksum) => {
          Mutation<FormData, { success: boolean; uploadedSize: number }>('api/file/upload-chunk', formData, 'static', {
            headers: {
              file_name: this.file_name,
              ext: extname(fileName),
              sended_at: Date.now(),
              bytesUploaded: this.startByte,
              totalFileSize: fileSize,
              checksum,
            },
            signal: this.controller?.signal,
          })
            .then((response) => {
              console.log('🚀 ~ ResumableUpload ~ .then ~ response:', response);
              // if chunk upload successful then plus the bytes
              if (response.success) {
                this.startByte += response.uploadedSize;
                const progress = (this.startByte / fileSize) * 100;
                this.onProgress(progress, this.isLoading, this.startByte);
                if (startByte < fileSize) {
                  this.uploadChunk();
                }
              }

              // if any chunk got corrupted then again upload that chunk
              if (!response.success) {
                if (startByte < fileSize) {
                  this.uploadChunk();
                }
              }
            })
            .catch((err) => {
              console.log('🚀 ~ ResumableUpload ~ uploadFileIntoChunks ~ err:', err);
              return (this.error = true);
            });
        })
        .catch((er) => {
          console.log('🚀 ~ ResumableUpload ~ uploadFileIntoChunks ~ er:', er);
          return this.error === true;
        });
    }
  }

  cancel() {
    this.controller?.abort();
  }
}
