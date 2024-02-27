import { Mutation, fetcher } from '@/utils/fetcher';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { useEffect, useState } from 'react';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { IMessageBubble } from '@/Atoms/chat/messageBubbles/MessageBubble';

interface IUseHandleVoiceMessageArgs extends IMessageBubble {
  message: MessageEntity | undefined;
  Me: UserEntity | undefined | null;
}

interface IUseHandleVoiceMessageState {
  isLoading: boolean;
  isError: boolean;
  voiceMessageUrl: string | null;
}

type IUseHandleVoiceMessage = (args: IUseHandleVoiceMessageArgs) => IUseHandleVoiceMessageState;

const useHandleVoiceMessage: IUseHandleVoiceMessage = ({ message, Me, ChatSlice, receiver_id, socket, isFromMe }) => {
  const [state, setState] = useState<IUseHandleVoiceMessageState>({ isError: false, isLoading: false, voiceMessageUrl: null });

  useEffect(() => {
    const init = async () => {
      // if the message is not sended yet then upload the media and send the message
      const media = await mainDb.media.get({ id: message?.media?.id });
      if (message && media && receiver_id && !message?.sended && message?.from.user_id === Me?.user_id) {
        // first we have to check if the media of this message is available or not
        // if the media is available then we will upload it and send the message
        if (media) {
          // upload it and send message
          try {
            setState((prev) => {
              return { ...prev, isLoading: true };
            });
            const formData = new FormData();
            formData.append('voice-message', media.file);
            await Mutation(`api/file/upload-voice-message`, formData, 'static', { headers: { file_name: media.id } });
            await sendMessageFn({ message, socket });
            await mainDb.offlineMedia.add({ file: media.file, id: media.id, mime: media.mime, type: media.type });
            await mainDb.media.delete(media.id);
            await mainDb.mediaMessages.delete(message?.id as string);
            const offlineMedia = await mainDb.offlineMedia.get(message.media?.id as string);
            setState({ isError: false, isLoading: false, voiceMessageUrl: URL.createObjectURL(offlineMedia?.file as Blob) });
            return;
          } catch (error) {
            setState((prev) => {
              return { ...prev, isError: true };
            });
          } finally {
            setState((prev) => {
              return { ...prev, isLoading: false };
            });
          }
        } else {
          // TODO: add message to DLQ
        }

        // if the message is sended and from me
      } else if (message?.sended && message.from.user_id === Me?.user_id) {
        if (message?.media) {
          const offlineMedia = await mainDb.offlineMedia.get(message.media.id);
          if (offlineMedia) {
            setState((prev) => {
              return { ...prev, voiceMessageUrl: URL.createObjectURL(offlineMedia.file) };
            });
          } else {
            const responseBlob = await fetcher(`api/file/get-voice-message/${message?.id}/${Me.user_id}`, undefined, 'blob', 'static');
            await mainDb.offlineMedia.add({ file: responseBlob, id: message.media.id, mime: 'audio/webm', type: 'audio' });
            setState((prev) => {
              return { ...prev, voiceMessageUrl: URL.createObjectURL(responseBlob) };
            });
          }
        }
        // if the message is not from me
        // fetch voice message from the server
      } else {
        if (message?.media) {
          const offlineMedia = await mainDb.offlineMedia.get(message.media.id);
          if (offlineMedia) {
            setState((prev) => {
              return { ...prev, voiceMessageUrl: URL.createObjectURL(offlineMedia.file) };
            });
          } else {
            const responseBlob = await fetcher(`api/file/get-voice-message/${message?.id}/${receiver_id}`, undefined, 'blob', 'static');
            await mainDb.offlineMedia.add({ file: responseBlob, id: message.media.id, mime: 'audio/webm', type: 'audio' });
            setState((prev) => {
              return { ...prev, voiceMessageUrl: URL.createObjectURL(responseBlob) };
            });
          }
        }
      }
    };
    init();
  }, [ChatSlice, Me?.user_id, message, receiver_id, socket]);

  return { ...state };
};

export default useHandleVoiceMessage;
