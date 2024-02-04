import { useEffect, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { mainDb } from '@/utils/mainIndexedDB';
import { fetcher } from '@/utils/fetcher';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { mutate } from 'swr';
import useSocket from './useSocket';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import { IProgressCallback, resumableUpload } from '@/utils/resumeableUpload';
import { managerCallback } from '../utils/resumeableUpload';

interface useMessageMediaState {
  isResumable: boolean;
  thumbnailUrl: string | undefined;
  isLoading: boolean;
  uploadProgress: number | undefined;
  error: boolean;
}

interface useFetchMessageArgs {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
  shouldContinue?: boolean;
}

const useFetchMediaMessage = ({ shouldContinue, isFromMe, message }: useFetchMessageArgs) => {
  const [mediaState, setMediaState] = useState<useMessageMediaState>({
    isResumable: false,
    thumbnailUrl: undefined,
    isLoading: true,
    uploadProgress: undefined,
    error: false,
  });

  const { socket } = useSocket();

  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice);

  useEffect(() => {
    const fetchVideoAndUpload = async () => {
      // First of all if the message is sended from our side then we will load the video and video thumbnail from local db
      // when the media message first mount then we will check from the server that the media is available or not
      // while we will show a loading bar
      // if the media is not available then we will and the uploaded chunks are 0 then we will automatically start to
      // make resumable upload. If the media not found on server and uploaded chunks are less than total chunks then we will
      // show a button to the user to resume the upload or not
      // if the user resume the upload the we will resume the upload, while uploading we will update the message state in the local storage

      try {
        if (isFromMe && message && message.media) {
          // checking media availability in the server
          const localDbMedia = await mainDb.media.get(message?.media.id);

          // getting media thumbnail
          if (message.messageType === 'image' || message.messageType === 'video' || message.messageType === 'svg') {
            const { thumbnailUrl } = await fetchMediaThumbnail(message, chatSlice.receiver_id, Me?.user_id, isFromMe);
            setMediaState((prev) => {
              return { ...prev, thumbnailUrl };
            });
          }

          const isAttachmentExisted = await fetcher<boolean>(
            `api/file/is-attachment-existed/${message?.media?.id}${message?.media?.ext}`,
            undefined,
            'json',
            'static',
          );
          // if media is not available on server and localMedia message uploaded chunks are 0 then automatically upload the media
          if (!isAttachmentExisted && message?.media && message?.media?.chunksUploaded === 0 && localDbMedia) {
            // setting loading to be false to show the upload progress
            console.log('here');

            setMediaState((prev) => {
              return { ...prev, isLoading: false };
            });

            const progressCallback: IProgressCallback = async (progress, _totalChunks, chunksUploaded) => {
              // setting upload progress
              setMediaState((prev) => {
                return { ...prev, uploadProgress: progress };
              });

              await mainDb.mediaMessages.update(message?.id, { media: { ...message.media, chunksUploaded } });
            };

            const managerCallback: managerCallback = (manager) => {
              if (!shouldContinue) {
                manager.abort();
              }
            };

            await resumableUpload(localDbMedia, message.media.chunksUploaded, progressCallback, managerCallback);

            // if user abort the upload then return from the
            if (!shouldContinue) {
              setMediaState((prev) => {
                return { ...prev, error: false, isLoading: false, isResumable: true };
              });
              return;
            }

            const messageToSend = await mainDb.mediaMessages.get(message.id);
            console.log('🚀 ~ fetchVideoAndUpload ~ messageToSend:', messageToSend);
            if (messageToSend) {
              await sendMessageFn({
                chatSlice,
                socket,
                receiver_id: chatSlice.receiver_id as string,
                message: { ...messageToSend, messageType: message.messageType },
              });
            }
            // deleting message from the main db
            await mainDb.mediaMessages.delete(message.id);

            // mutating the media api
            // TODO: have to implement single chat req
            await mutate(`api/chats`);
          }

          // if the attachment is not existed on server and uploaded chunks are more than 0, means that the user first started uploading
          // but it was failed, then we will show the user a upload button to resume it manually
          else if (!isAttachmentExisted && message?.media?.chunksUploaded && message?.media?.chunksUploaded > 0) {
            setMediaState((prev) => {
              return { ...prev, isResumable: true };
            });
          }

          setMediaState((prev) => {
            return { ...prev, uploadProgress: 100 };
          });
          setMediaState((prev) => {
            return { ...prev, isLoading: false };
          });
        }

        // if the media message is not from me
        // then we have to load this video from the server
        if (!isFromMe) {
          const { thumbnailUrl } = await fetchThumbnailFromTheServer({ isFromMe, message, receiver_id: chatSlice.receiver_id, user_id: Me?.user_id });
          setMediaState((prev) => {
            return { ...prev, thumbnailUrl, isLoading: false, error: false };
          });
        }
      } catch (error) {
        console.log('🚀 ~ fetchVideoAndUpload ~ error:', error);
        setMediaState((prev) => {
          return { ...prev, error: true };
        });
      }
    };

    fetchVideoAndUpload();
  }, [message, isFromMe, chatSlice, socket, Me?.user_id, shouldContinue]);

  return mediaState;
};

export default useFetchMediaMessage;

type fetchThumbnailFromTheServerArgs = {
  isFromMe: boolean | undefined;
  message: MessageEntity | undefined;
  user_id: string | undefined;
  receiver_id: string | undefined;
};

type fetchThumbnailFromTheServerFn = (args: fetchThumbnailFromTheServerArgs) => Promise<{ thumbnailUrl: string | undefined }>;

const fetchThumbnailFromTheServer: fetchThumbnailFromTheServerFn = async ({ isFromMe, message, receiver_id, user_id }) => {
  try {
    const userId = isFromMe ? user_id : receiver_id;
    const videoThumbnailFetcherUrl = `api/file/get-attachment/${userId}/${message?.media?.id}-thumbnail/.png`;
    const imageThumbnailFetcherUrl = `api/file/get-attachment/${userId}/${message?.media?.id}/${message?.media?.ext}`;
    if (message?.messageType === 'image' || message?.messageType === 'video' || message?.messageType === 'svg') {
      const thumbnailBlob = await fetcher(message?.messageType === 'video' ? videoThumbnailFetcherUrl : imageThumbnailFetcherUrl, undefined, 'blob', 'static');

      if (thumbnailBlob instanceof Blob) {
        const thumbnailUrl = URL.createObjectURL(thumbnailBlob);
        return { thumbnailUrl };
      } else {
        // Handle the case where fetcher didn't return a Blob
        return { thumbnailUrl: undefined };
      }
    }
    return { thumbnailUrl: undefined };
  } catch (error) {
    // Handle errors (e.g., network issues, fetcher failures)
    console.error('Error fetching thumbnail:', error);
    return { thumbnailUrl: undefined };
  }
};

const fetchMediaThumbnail = async (
  message: MessageEntity,
  receiver_id: string | undefined,
  user_id: string | undefined,
  isFromMe: boolean | undefined,
): Promise<{ thumbnailUrl: string | undefined }> => {
  try {
    console.log(message);

    if (message.media) {
      // getting media from the local db
      const media = await mainDb.media.get(message.media?.id);

      // if the message is a vide type
      if (message.messageType === 'video') {
        // if there is media in the local db
        if (media?.thumbnail) {
          const thumbnailUrl = URL.createObjectURL(media.thumbnail as Blob);
          return { thumbnailUrl };
        }

        // if there is no media in local db then we are going to fetch it from the server
        const { thumbnailUrl } = await fetchThumbnailFromTheServer({ isFromMe, message, receiver_id, user_id });
        return { thumbnailUrl };
      }
      // if the message is an image or svg
      else if (message.messageType === 'image' || message.messageType === 'svg') {
        // if the file existed in the local db
        if (media?.file) {
          const thumbnailUrl = URL.createObjectURL(media?.file);
          return { thumbnailUrl };
        }

        // if the file is not existed in the local db then
        const { thumbnailUrl } = await fetchThumbnailFromTheServer({ isFromMe, message, receiver_id, user_id });
        return { thumbnailUrl };
      } else {
        return { thumbnailUrl: undefined };
      }
    }
    return { thumbnailUrl: undefined };
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return { thumbnailUrl: undefined };
  }
};
