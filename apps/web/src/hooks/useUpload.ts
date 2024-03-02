import { Mutation, fetcher } from '@/utils/fetcher';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import { IPerformAction, IResumableUploadProgress, ResumableUpload } from '@/utils/resumeableUpload-beta';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { extname } from 'path';

export type IUploadState = { progress?: number; isLoading?: boolean; uploadedFileSize?: number; isResumable: boolean | undefined; error?: boolean };

export type IUseUploadArgs = { message: MessageEntity | undefined; isFromMe: boolean | undefined; lastAction?: IPerformAction };

export type isFileExistedType = { uploadedFileSize: number; chunksDirectory: boolean; isFileExisted: boolean };

export type IUseUpload = (args: IUseUploadArgs) => {
  uploadManager: ResumableUpload | undefined;
  state: IUploadState | undefined;
  setState: Dispatch<SetStateAction<IUploadState | undefined>>;
  retry: () => void;
  download: () => void;
  cancel: () => void;
};

const useUpload: IUseUpload = ({ isFromMe, message, lastAction }) => {
  const [uploadManager, setUploadManager] = useState<ResumableUpload | undefined>();

  const [state, setState] = useState<IUploadState>();

  useEffect(() => {
    const getManager = async () => {
      // first we will send request to the server to find out how many bytes has been uploaded
      // if the chunksDirectory of chunks does not existed the we will start to upload automatically
      // if the chunksDirectory existed then we will check how many bytes has been sended, we will match with
      // the local db "uploadedFileSize", if the value does match then we will give the responsibility to user wether upload
      // this media or not, if the user chooses to upload then we will upload it, if the use does not, then this message will be already in the DLQ
      // after the expiration if the message (5 min) the message will be deleted from the local db and not recoverable.
      const localFile = await mainDb.media.get(message?.media?.id as string);

      if (message?.media?.id && localFile) {
        const isFileExisted = await fetcher<isFileExistedType>(`api/file/chunks-size/${message?.media?.id}`, undefined, 'json', 'static', {
          ext: extname(localFile?.file.name as string),
        });

        setState((prev) => {
          return { ...prev, isResumable: false, uploadedFileSize: isFileExisted.uploadedFileSize, progress: 100 };
        });

        // if the file existed then we will return from the function
        if (isFileExisted.isFileExisted && isFileExisted?.uploadedFileSize === message.media.size) {
          setState((prev) => {
            return { ...prev, isResumable: false, isLoading: false, progress: 100, uploadedFileSize: isFileExisted.uploadedFileSize };
          });
          return;
        }

        // if the chunksDirectory does not existed and file does not exists at all then we will start the upload automatically
        else if (!isFileExisted.isFileExisted && !isFileExisted.chunksDirectory && isFileExisted.uploadedFileSize === 0) {
          if (message.messageType === 'video' || message.messageType === 'image') {
            setState((prev) => {
              return { ...prev, isLoading: true, isResumable: false };
            });

            const ImageBlob = new Blob([localFile.file]);
            const thumbnailBlob = message.messageType === 'video' ? localFile.thumbnail : ImageBlob;
            await uploadThumbnail(thumbnailBlob, message);
          }

          const onProgress: IResumableUploadProgress = async (progress, isLoading, uploadedBytes) => {
            setState((prev) => {
              return { ...prev, isResumable: false, isLoading, progress, uploadedFileSize: uploadedBytes };
            });
          };
          const manager = new ResumableUpload({
            selectedFile: localFile,
            file_name: localFile?.id,
            startByte: 0,
            onProgress,
            lastAction,
            height: message.media.height,
            width: message.media.width,
          });
          setState((prev) => {
            return { ...prev, isLoading: true, isResumable: false };
          });
          manager.uploadChunk();
          setUploadManager(manager);
        }
        // if the chunksDirectory existed but the uploaded file size is less than the total file size
        else if (isFileExisted.chunksDirectory && localFile?.file.size && isFileExisted.uploadedFileSize < localFile?.file.size) {
          const onProgress: IResumableUploadProgress = async (progress, isLoading, uploadedBytes) => {
            setState((prev) => {
              return { ...prev, isResumable: false, isLoading, progress, uploadedFileSize: uploadedBytes };
            });
          };
          const manager = new ResumableUpload({
            selectedFile: localFile,
            file_name: localFile?.id,
            startByte: isFileExisted.uploadedFileSize,
            onProgress,
            lastAction,
            height: message.media.height,
            width: message.media.width,
          });
          setUploadManager(manager);
          setState((prev) => {
            return {
              ...prev,
              isResumable: true,
              isLoading: false,
              progress: (isFileExisted.uploadedFileSize / localFile.file.size) * 100,
              uploadedFileSize: isFileExisted.uploadedFileSize,
            };
          });
        }
        // if the chunks directory with full size of file the merge chunks
        else if (isFileExisted.chunksDirectory && isFileExisted.uploadedFileSize === localFile?.file.size && !isFileExisted.isFileExisted) {
          await fetcher(`api/file/merge-chunks/${message.media.id}`, undefined, 'json', 'static', { ext: extname(localFile.file.name) });
        } else {
          //TODO: add message to DLQ
        }
      } else {
        // TODO: show error if the file and local file does not exists
        setState((prev) => {
          return { ...prev, isResumable: false, progress: 100, isLoading: false, error: false };
        });
      }
    };

    if (isFromMe) {
      getManager();
    } else {
      setState((prev) => {
        return { ...prev, isResumable: false, error: false, isLoading: false, progress: 100 };
      });
    }
  }, [isFromMe, message?.media?.id, message?.media?.size, lastAction, message]);

  const retry = () => {
    if (uploadManager) {
      try {
        uploadManager?.resume();
        fetcher<isFileExistedType>(`api/file/chunks-size/${message?.media?.id}`, undefined, 'json', 'static').then(async (response) => {
          // if the chunks directory existed and uploaded chunks size is less than the total media size
          if (response.chunksDirectory && message?.media?.size && response.uploadedFileSize < message?.media?.size) {
            uploadManager.uploadChunk(response?.uploadedFileSize);
          }
          // if the chunks directory exists and chunks uploaded completely and file does not exists then merge chunks
          else if (response.chunksDirectory && response.uploadedFileSize === message?.media?.size && !response.isFileExisted) {
            setState((prev) => {
              return { ...prev, isResumable: false, isLoading: true, progress: 100, uploadedFileSize: response.uploadedFileSize };
            });
            await fetcher(`api/file/merge-chunks/${message.media.id}`, undefined, 'json', 'static', { ext: extname(message?.media?.original_name as string) });
          } else {
            // error occurred
            setState((prev) => {
              return { ...prev, error: true, isResumable: false };
            });
          }
        });
      } catch (error) {
        setState((prev) => {
          return { ...prev, isResumable: false, progress: 100, isLoading: false };
        });
      }
    }
  };

  const cancel = () => {
    setState((prev) => {
      return { ...prev, isResumable: true };
    });
    uploadManager?.cancel();
  };
  const download = () => {
    const downloadLink = `api/file/attachment-download/${message?.media?.path}`;
    const link = document.createElement('a');
    link.href = downloadLink;
    link.click();
  };

  return { state, uploadManager, setState, retry, cancel, download };
};

export default useUpload;

const uploadThumbnail = async (thumbnailBlob: string | Blob | null | undefined, message: MessageEntity) => {
  if (thumbnailBlob) {
    try {
      const formData = new FormData();
      formData.append('attachment-thumbnail', thumbnailBlob);
      const ext = message.messageType === 'video' ? '.png' : message.media?.ext;
      const response = await Mutation<FormData, { success: boolean }>(`api/file/upload-attachment-thumbnail`, formData, 'static', {
        headers: { file_name: message.media?.id, ext, height: message.media?.height, width: message.media?.width, mime: message.media?.mime },
      });
      return response.success;
    } catch (error) {
      return false;
    }
  }
  return false;
};
