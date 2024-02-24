import { extname } from 'path';
import { Mutation } from './fetcher';
import { createFileChunk } from './file/createFileChunk';
import { calculateChecksumPromise } from './file/calculateFileChecksum';
import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';

type IPerformActionArgs = { uploadedBytes: number | undefined; progress: number };

export type IPerformAction = (args: IPerformActionArgs) => Promise<void>;

export type IResumableUploadProgress = (progress: number, isLoading: boolean, uploadedBytes: number) => void;

export interface ResumableUploadProps {
  selectedFile: SelectedFileType | null | undefined;
  file_name: string | undefined;
  startByte?: number;
  onProgress: IResumableUploadProgress;
  lastAction?: IPerformAction;
  height: number | null;
  width: number | null;
}

export class ResumableUpload {
  private selectedFile: SelectedFileType | null | undefined = null;
  private file_name: string | null | undefined;
  private isLoading: boolean = true;
  private onProgress: IResumableUploadProgress;
  private controller: AbortController | null = null;
  private startByte: number = 0;
  private error: boolean = false;
  private lastAction: IPerformAction | undefined;
  private height: number | null;
  private width: number | null;

  constructor(props: ResumableUploadProps) {
    this.selectedFile = props.selectedFile;
    this.file_name = props.file_name;
    this.onProgress = props.onProgress;
    this.startByte = props.startByte || 0;
    this.isLoading = true;
    this.lastAction = props.lastAction;
    this.height = props.height;
    this.width = props.width;

    if (!this.controller) {
      this.controller = new AbortController();
    }
  }

  uploadChunk(startByte?: number) {
    {
      if (startByte) {
        this.startByte = startByte;
      }

      this.isLoading = false;
      this.uploadFileIntoChunks(this.startByte);
    }
  }

  private async uploadFileIntoChunks(startByte: number) {
    if (this.selectedFile && this.selectedFile.file.size) {
      const fileSize = this.selectedFile.file.size;
      const chunk = createFileChunk(this.selectedFile.file, this.startByte, 1);
      const formData = new FormData();
      formData.append('attachment-chunk', chunk);
      const fileName = this.selectedFile.file.name;

      calculateChecksumPromise(chunk)
        .then((checksum) => {
          Mutation<FormData, { success: boolean; uploadedSize: number }>('api/file/upload-chunk', formData, 'static', {
            headers: {
              file_name: this.file_name,
              ext: extname(fileName),
              sended_at: Date.now(),
              bytes_uploaded: this.startByte,
              total_file_size: fileSize,
              checksum,
              file_checksum: this.selectedFile?.fileChecksum,
              height: this.height,
              width: this.width,
              mime: this.selectedFile?.mime,
            },
            signal: this.controller?.signal,
          })
            .then(async (response) => {
              // if chunk upload successful then plus the bytes
              if (response.success) {
                this.startByte += response.uploadedSize;
                const progress = (this.startByte / fileSize) * 100;

                if (progress === 99) {
                  this.isLoading = true;
                }

                if (progress === 100) {
                  this.isLoading = false;
                }

                this.onProgress(progress, this.isLoading, this.startByte);

                if (startByte === fileSize) {
                  if (this.lastAction) {
                    this.isLoading = true;
                    await this.lastAction({ uploadedBytes: this.startByte, progress });
                    this.isLoading = false;
                  }
                }
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
              return (this.error = true);
            });
        })
        .catch((er) => {
          return this.error === true;
        });
    }
  }

  cancel() {
    this.controller?.abort();
  }

  resume() {
    this.controller = new AbortController();
  }
}
