import { isAttachmentResumableResponseType } from '@static-assets-server/modules/localupload/types/response.types';
import { fetcher } from './fetcher';
import { resumableUpload } from './resumeableUpload';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';

interface IMakeResumableUploadArgs {
  message: MessageEntity;
  media: SelectedFileType | undefined;
  progressCallback: (progress: number, totalChunks: number, chunkNumber: number) => void;
}
type IMakeResumableUpload = (args: IMakeResumableUploadArgs) => void;

export const makeResumableUpload: IMakeResumableUpload = async ({ message, media, progressCallback }) => {
  // trying to get the info of the file from the server
  const isExisted = await fetcher<boolean>(`api/file/is-attachment-existed/${message.media?.id}/${message.media?.ext}`, undefined, 'json', 'static');
  if (isExisted) {
    progressCallback(100, 0, 0);
    return;
  }

  // if the file is not existed in the server
  // then we will check if there are some chunks already if this file in the server
  // if there are some chunks then we will resume the uploading and else we will upload it

  const response = await fetcher<isAttachmentResumableResponseType>(`api/file/can-resumable-attachment/${message.media?.id}`, undefined, 'json', 'static');

  if (!response.resumable) {
    // if it is not resumable, then we are going to upload it
    if (media) {
      // if we have media in locally then we will make a resumable upload, if not this message will be
      // deleted from the local storage and added to DLQ
      await resumableUpload(media, response.lastChunk, progressCallback);
    }
  }

  // if the file is resumable then we will get the last chunk that have been sended and then we will resume the file
  if (response.resumable && media) {
    await resumableUpload(media, response.lastChunk, progressCallback);
  }
};
