import { IMessageBubblePreview } from '@/Atoms/types/messageBubble.types';
import Image from 'next/image';
import { FC, useCallback, useMemo } from 'react';
import MediaMessageBubbleWrapper from './MediaMessageBubbleWrapper';
import MediaMessageStatus from './MediaMessageStatus';
import { calculateScaledDimensions } from '@/utils/calculateScaledDimensions';
import { useDispatch } from 'react-redux';
import { useFetchMediaThumbnail } from '@/hooks/useFetchMediaThumbnail';
import useUpload from '@/hooks/useUpload';
import { setActiveGalleryMedia } from '@/global/features/GallerySlice';
import { toggleGalleryOverlay } from '@/global/features/overlaySlice';
import ProgressBar from '@/Atoms/misc/ProgressBar';
import useCurrentChat from '@/hooks/useCurrentChat';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import useFetchImage from '@/hooks/useFetchImage';

export const MessageBubbleImagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe, socket, Me }) => {

  const dimensions = useMemo(
    () => calculateScaledDimensions(message?.media?.width, message?.media?.height, 300, 300, 200, 200),
    [message?.media?.height, message?.media?.width],
  );

  const { raw_chat } = useCurrentChat();

  const lastAction = useCallback(() => {
    const lastAction = async () => {
      if (message && raw_chat) {
        const messageToSend: MessageEntity = {
          id: message.id,
          chat: { chat_for: raw_chat?.chat_for, chat_with: raw_chat?.chat_with, id: raw_chat?.id, },
          clear_for: null,
          content: message?.content,
          from: Me as any,
          is_seen: false,
          media: { ...message?.media as any, path: `${Me?.user_id}/${message?.media?.id}` },
          messageType: message.messageType,
          received_at: null,
          seen_at: null,
          sended: false,
          sended_at: new Date(),
        };
        const sended = await sendMessageFn({ message: messageToSend, socket });
        if (sended) {
          await mainDb.media.delete(message.media?.id as string);
          await mainDb.mediaMessages.delete(message.id);
        }
      }
    };
    return lastAction();
  }, [Me, message, raw_chat, socket]);


  const dispatch = useDispatch();

  const { thumbnailState } = useFetchMediaThumbnail({ isFromMe, message });

  const { cancel, download, retry, state } = useUpload({ isFromMe, message, lastAction });

  const { imageUrl } = useFetchImage({ message: message?.media as any })

  const handleGalleryOverlay = (id: string | undefined) => {
    if (id && message?.media) {
      dispatch(setActiveGalleryMedia({ ...message?.media, message: message }));
    }
    dispatch(toggleGalleryOverlay());
  };

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
    <MediaMessageBubbleWrapper
      isFromMe={isFromMe}
      messageType={message?.messageType}
      className="flex place-items-center justify-center"
      height={dimensions.height}
      width={dimensions.width}
      onClick={() => handleGalleryOverlay(message?.media?.id)}
    >
      {message?.messageType === "svg" ? <>
        <span style={{ width: "100%", height: "100%" }} className='bg-transparent_bg bg-cover'>
          {imageUrl ?
            <Image key={message?.media?.id} src={imageUrl as string} loading="lazy" alt={''} fill />
            : null}
        </span></> :
        <span style={{ width: "100%", height: "100%", backgroundImage: `url(${thumbnailState.thumbnail})`, backgroundSize: "cover" }} >
          {imageUrl ?
            <Image key={message?.media?.id} src={imageUrl as string} loading="lazy" alt={''} fill />
            : null}
        </span>}

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900"></div>
      {/* progress bar */}
      {
        isFromMe ? (
          <ProgressBar
            barStyle="circle"
            isResumable={state?.isResumable}
            isLoading={state?.isLoading}
            progress={state?.progress}
            showActionButton
            messageType={message?.messageType}
            onRetryClick={handleRetry}
            onPauseClick={handlePause}
            onActionButtonClick={handleDownload}
            className='absolute'
          />
        ) : null
      }

      <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
    </MediaMessageBubbleWrapper >
  );
};
