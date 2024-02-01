import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { mainDb } from './mainIndexedDB';
import { fetcher } from './fetcher';
import { IProgressCallback, resumableUpload } from './resumeableUpload';
import { sendMessageFn } from './sendMessageFn';
import { IChatSlice } from '@/global/features/ChatSlice';
import { ISocket_Client } from './createSocket';
import { mutate } from 'swr';

interface fetchMessageMediaCallbackArgs {
  thumbnailUrl: string | undefined;
  isResumable: boolean;
  loading: boolean;
  error: boolean;
  progress: number | undefined;
}

interface fetchMessageMediaArgs {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
  chatSlice: IChatSlice;
  socket: ISocket_Client;
  callback: (args: fetchMessageMediaCallbackArgs) => void;
}

type fetchMessageMediaFn = (args: fetchMessageMediaArgs) => void;

export const fetchMessageMedia: fetchMessageMediaFn = async ({ isFromMe, message, chatSlice, socket, callback }) => {
  try {
    callback({ loading: true, error: false, isResumable: false, thumbnailUrl: undefined, progress: undefined });

    if (isFromMe && message && message.media) {
      // checking media availability in the server
      const localDbMedia = await mainDb.media.get(message?.media.id);

      // getting vide thumbnail form local db
      const videoThumbnail = URL.createObjectURL(localDbMedia?.thumbnail as Blob);
      if (videoThumbnail) {
        callback({ error: false, isResumable: false, loading: true, thumbnailUrl: videoThumbnail, progress: undefined });
        //  setMediaState((prev) => {
        //    return { ...prev, videoThumbnail };
        //  });
      }

      const isAttachmentExisted = await fetcher<boolean>(
        `api/file/is-attachment-existed/${message?.media?.id}/${message?.media?.ext}`,
        undefined,
        'json',
        'static',
      );
      // if media is not available on server and localMedia message uploaded chunks are 0 then automatically upload the media
      if (!isAttachmentExisted && message?.media && message?.media?.chunksUploaded === 0 && localDbMedia) {
        // setting loading to be false to show the upload progress
        //  setLoading(false);
        const progressCallback: IProgressCallback = async (progress, _totalChunks, chunksUploaded) => {
          // setting upload progress
          //  setUploadProgress(progress);
          callback({ loading: false, error: false, isResumable: false, progress, thumbnailUrl: videoThumbnail });
          await mainDb.mediaMessages.update(message?.id, { media: { ...message.media, chunksUploaded } });
        };
        await resumableUpload(localDbMedia, message.media.chunksUploaded, progressCallback);

        const messageToSend = await mainDb.mediaMessages.get(message.id);
        if (messageToSend) {
          await sendMessageFn({ chatSlice, socket, receiver_id: chatSlice.receiver_id as string, message: { ...messageToSend, messageType: 'video' } });
        }
        // deleting message from the main db
        await mainDb.mediaMessages.delete(message.id);

        // mutating the media api
        await mutate(`api/chats`);
      }

      // if the attachment is not existed on server and uploaded chunks are more that 0, means that the user first started uploading
      // but it was failed, then we will show the user a upload button to resume it manually
      else if (!isAttachmentExisted && message?.media?.chunksUploaded && message?.media?.chunksUploaded > 0) {
        callback({ error: false, isResumable: true, loading: false, progress: undefined, thumbnailUrl: videoThumbnail });
      }
    }

    // if the media message is not from me
    // then we have to load this video from the server
    if (!isFromMe) {
      // we will load the video thumbnail from the server, and if the user clicks on the video then we will stream it in gallery
      const videoThumbnailBlob = await fetcher(
        `api/file/get-attachment/${chatSlice.receiver_id}/${message?.media?.id}-thumbnail/.png`,
        undefined,
        'blob',
        'static',
      );
      if (videoThumbnailBlob instanceof Blob) {
        console.log('🚀 ~ fetchVideoAndUpload ~ videoThumbnailBlob:', videoThumbnailBlob);
        const videoThumbnailUrl = URL.createObjectURL(videoThumbnailBlob);
        callback({ error: false, isResumable: false, loading: false, progress: undefined, thumbnailUrl: videoThumbnailUrl });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
