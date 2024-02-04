import { extname } from 'path';
import { Mutation } from './fetcher';

type IPerformActionArgs = { chunksUploaded: number; totalChunks: number; progress: number };

export type IPerformAction = (args: IPerformActionArgs) => void | Promise<void>;

export interface ResumableUploadProps {
  file: File | null;
  startFromChunk: number | undefined;
  file_name: string;
  onProgress: (progress: number, isLoading: boolean) => void;
  performAction?: IPerformAction;
}

export class ResumableUpload {
  private file: File | null = null;
  private file_name: string | null;
  private startFromChunk: number = 0;
  private currentChunk: number = 0;
  private totalChunks: number;
  private chunks: Blob[] = [];
  private isLoading: boolean = true;
  private onProgress: (progress: number, isLoading: boolean) => void;
  private controller: AbortController | null = null;
  private performAction: IPerformAction | undefined;

  constructor(props: ResumableUploadProps) {
    this.file = props.file;
    this.startFromChunk = props.startFromChunk || 0;
    this.file_name = props.file_name;
    this.onProgress = props.onProgress;
    this.performAction = props.performAction;

    if (!this.controller) {
      this.controller = new AbortController();
    }
  }

  uploadChunk() {
    if (this.file) {
      if (!this.chunks || !this.totalChunks) {
        this.splitFileIntoChunks();
      }

      const formData = new FormData();
      formData.append('attachment-chunk', this.chunks[this.currentChunk]);

      this.isLoading = false;
      this.sendChunk(formData);
    }
  }

  private splitFileIntoChunks() {
    // if there is file and the signal is not aborted then resume upload
    if (this.file && !this.controller?.signal.aborted) {
      const totalChunks = Math.ceil(this.file?.size / (2 * 1024 * 1024));
      const chunkSize = Math.ceil(this.file.size / totalChunks);

      const chunks = [];

      // Splitting file into chunks starting from the specified index
      for (let i = this.startFromChunk; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        chunks.push(this.file.slice(start, end));
      }

      this.totalChunks = totalChunks;
      this.chunks = chunks;

      if (this.currentChunk < this.totalChunks - 1) {
        this.isLoading = false;
      }

      if (this.currentChunk === this.totalChunks - 1) {
        this.isLoading = false;
      }
    }
  }

  private sendChunk(formData: FormData) {
    if (this.currentChunk === this.totalChunks - 2) {
      this.isLoading = true;
    }
    if (this.file) {
      Mutation<FormData, { success: boolean; chunkNumber: number }>(
        `api/file/chunk-upload?chunk=${this.currentChunk}&chunks=${this.totalChunks}`,
        formData,
        'static',
        {
          headers: {
            file_name: this.file_name,
            chunk_number: this.currentChunk,
            ext: extname(this.file?.name),
          },
          signal: this.controller?.signal,
        },
      )
        .then((response) => {
          if (response.success) {
            this.currentChunk++;

            const progress = (this.currentChunk / this.totalChunks) * 100;

            this.onProgress(progress, this.isLoading);

            // perform action from the parent
            if (this.performAction) {
              this.performAction({ chunksUploaded: this.currentChunk, progress, totalChunks: this.totalChunks });
            }

            if (this.currentChunk < this.totalChunks) {
              this.uploadChunk();
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  cancel() {
    this.controller?.abort();
  }
}
