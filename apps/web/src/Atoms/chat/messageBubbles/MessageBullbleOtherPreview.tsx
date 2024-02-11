import { IMessageBubblePreview } from '@/Atoms/types/messageBubble.types';
import { FC, useCallback } from 'react';
import MediaMessageStatus from './MediaMessageStatus';
import Image from 'next/image';
import { convertFileSizeFromBytes } from '@/utils/getFIleSizeFromBytes';
import { clampString } from '@/utils/clamp';
import ProgressBar from '@/Atoms/misc/ProgressBar';
import useUpload from '@/hooks/useUpload';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useCurrentChat from '@/hooks/useCurrentChat';
import { mainDb } from '@/utils/mainIndexedDB';

export const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message, messageLines, isFromMe, Me, socket }) => {

  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { raw_chat } = useCurrentChat();

  const lastAction = useCallback(() => {
    console.log('sending message');
    const lastAction = async () => {
      if (message) {
        const messageToSend: MessageEntity = {
          id: message.id,
          chat: raw_chat as any,
          clear_for: null,
          content: message?.content,
          from: Me as any,
          is_seen: false,
          media: message?.media,
          messageType: message.messageType,
          received_at: null,
          seen_at: null,
          sended: false,
          sended_at: new Date(),
        };
        const sended = await sendMessageFn({ chatSlice, message: messageToSend, receiver_id: chatSlice.receiver_id as string, socket });
        if (sended) {
          await mainDb.media.delete(message.media?.id as string);
          await mainDb.mediaMessages.delete(message.id);
        }
      }
    };
    return lastAction();
  }, [Me, chatSlice, message, raw_chat, socket]);

  const { state, cancel, download, retry } = useUpload({ isFromMe, message, lastAction });
  console.log('🚀 ~ state:', state);

  // manual upload
  const handleRetry = () => {
    retry();
  };
  const handlePause = () => {
    cancel();
  };

  const handleDownload = () => {
    download();
  };

  return (
    <div
      className={`bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark flex ${isFromMe ? 'h-[100px]' : 'h-fit border-[2px] border-whatsapp-light-placeholder_text dark:border-whatsapp-dark-placeholder_text'} w-[350px] flex-col rounded-md p-1${isFromMe
        ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
        : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
        } `}
    >
      <div className={`flex-1/3 flex h-fit place-items-center justify-between rounded-md bg-black bg-opacity-20 ${isFromMe ? 'p-1' : 'p-2'}`}>
        <div className="flex place-items-center gap-2 p-2">
          <Image src={'/icons/preview-generic.svg'} width={40} height={50} alt="file" />
          <div className="flex flex-col gap-2 text-white text-opacity-80">
            <span className="line-clamp-1 text-sm">{clampString(message?.media?.original_name || 'file', 25)}</span>
            <span className="flex gap-1 text-xs text-[#86a3b3]">
              <span>{message?.media?.ext}</span>
              <span>{convertFileSizeFromBytes(message?.media?.size || 0, '•')}</span>
            </span>
          </div>
        </div>
        <span className="flex place-items-center justify-center">
          {/* progress bar */}
          {isFromMe ? (
            <ProgressBar
              barStyle="circle"
              isResumable={state?.isResumable}
              isLoading={state?.isLoading}
              progress={state?.progress}
              showActionButton
              onRetryClick={handleRetry}
              onPauseClick={handlePause}
              onActionButtonClick={handleDownload}
              messageType={message?.messageType}
            />
          ) : null}
        </span>
        {!isFromMe ? (
          <span className="flex h-12 w-12 cursor-pointer place-items-center justify-center rounded-full bg-black bg-opacity-40" onClick={handleDownload}>
            <Image src={'/icons/gallery-icons/download.svg'} height={25} width={25} alt="download" />
          </span>
        ) : null}
      </div>
      {isFromMe ? (
        <div className="flex-1/3 relative h-[30%]">
          <MediaMessageStatus isFromMe={isFromMe} message={message} messageLines={messageLines} />
        </div>
      ) : null}
    </div>
  );
};
