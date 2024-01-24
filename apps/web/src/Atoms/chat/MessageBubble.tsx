import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import dayjs from 'dayjs';
import Image from 'next/image';
import { mainDb } from '@/utils/mainIndexedDB';
import { fetcher } from '@/utils/fetcher';
import VideoWithPlaceholder from '@/components/Misc/VideoWithPlaceholder';

interface IMessageBubble {
  isFromMe: boolean | undefined;
  message: MessageEntity | undefined;
}

const MessageBubble: FC<IMessageBubble> = ({ isFromMe, message }) => {
  const [messageLines, setMessageLines] = useState<number>(1);

  const messageRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (messageRef.current) {
      const lines = Math.ceil(messageRef.current.clientHeight / parseFloat(getComputedStyle(messageRef.current).lineHeight || '1.2em'));
      setMessageLines(lines);
    }
  }, [message]);

  return (
    <span
      ref={messageRef}
      className={`relative flex h-fit w-fit max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] ${isFromMe
        ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
        : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
        }`}
    >
      <span style={{ whiteSpace: 'pre-wrap' }} className={`w-fit max-w-full break-words  ${messageLines > 2 ? 'pb-2' : ''}`}>
        {message?.messageType === 'image' ? <MessageBubbleImagePreview message={message} isFromMe={isFromMe} /> : message?.messageType === "video" ? <MessageBubbleVideoPreview message={message} isFromMe={isFromMe} /> : message?.messageType === "svg" ? <MessageBubbleSvgPreview message={message} isFromMe={isFromMe} /> : message?.messageType === "others" ? <MessageBubbleOtherFilesPreview message={message} isFromMe={isFromMe} /> : <TextMessagePreview message={message} isFromMe={isFromMe} />}

      </span>
      {isFromMe ? (
        <span className={`flex place-items-center justify-evenly gap-1 pl-1  ${messageLines > 2 ? 'absolute bottom-0 right-0 mt-4' : 'place-self-end'}`}>
          <span className="mt-1 flex text-[10px] text-white text-opacity-70">{message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}</span>
          <span className="flex place-items-center ">
            {message?.seen_at ? (
              // Render the icon for seen messages
              <OptionIcon src="/icons/seen.svg" height={18} width={18} />
            ) : message?.received_at ? (
              // Render the icon for received messages
              <OptionIcon src="/icons/sended.svg" height={18} width={18} />
            ) : message?.sended ? (
              // Render the icon for sent messages
              <OptionIcon src="/icons/msg-check.svg" height={18} width={18} />
            ) : (
              // Render the loading icon for other cases
              <OptionIcon src="/icons/status-time.svg" height={15} width={15} />
            )}
          </span>
        </span>
      ) : null}
    </span>
  );
};

export default MessageBubble;


interface IMessageBubblePreview {
  message: MessageEntity | undefined
  isFromMe: boolean | undefined
}


const MessageBubbleImagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (isFromMe && message && message.media) {
        try {
          // Try to get the image from the local database
          const media = await mainDb.media_messages.get(message.media.id);
          if (media?.file) {
            const blob = new Blob([media.file], { type: media.file.type });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            // If not found in the local database, fetch it from the network
            const blob = await fetcher(`api/file/get-attachment/${message.media.path}/${message.media.ext}`, undefined, "blob", "static");
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
    };

    fetchData();
  }, [isFromMe, message]);

  return (
    <div className='h-96 w-44'>
      <Image src={imageUrl || '/placeholders/placeholder-image.svg'} alt={'broken image'} fill objectFit='cover' />
    </div>
  );
};



const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message }) => {

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)

  useEffect(() => {

    const fetchVideo = async () => {

      if (message?.media) {
        // get the thumbnail from local data base
        const result = await mainDb.media_messages.get(message?.media.id)
        if (result?.thumbnail instanceof Blob) {
          const thumbnailUrl = URL.createObjectURL(result.thumbnail)
          setVideoThumbnail(thumbnailUrl)
        }

      }

      const fetchedThumbnailBlob = await fetcher(`api/file/get-attachment/${message?.media?.path}/${message?.media?.ext}`, undefined, 'blob', "static")
      const videoThumbnailUrl = URL.createObjectURL(fetchedThumbnailBlob)
      setVideoThumbnail(videoThumbnailUrl)

      if (message?.media) {
        const video = await mainDb.media_messages.get(message?.media.id)
        setVideoUrl(video?.url as string)

      }
      const videoBlob = await fetcher(`api/file/get-attachment-file/${message?.media?.id}/${message?.media?.ext}`)
      const video = URL.createObjectURL(videoBlob)
      setVideoUrl(video)


    }
    fetchVideo()

  }, [message?.media])

  return (
    <div>
      <VideoWithPlaceholder isLoading videoUrl={videoUrl} thumbnailUrl={videoThumbnail} key={message?.media?.id} />
      {/* {videoUrl ? <video src={videoUrl}></video> : videoThumbnail ? <Image src={videoThumbnail} alt='video' /> : <Image src={'path/to/placeholder-image'} alt='Video' />} */}

    </div>
  )
}




const MessageBubbleSvgPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (isFromMe && message && message.media) {
        try {
          // Try to get the image from the local database
          const media = await mainDb.media_messages.get(message.media.id);
          if (media?.file) {
            const blob = new Blob([media.file], { type: media.file.type });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            // If not found in the local database, fetch it from the network
            const blob = await fetcher(`api/file/get-attachment/${message.media.path}/${message.media.ext}`, undefined, "blob", "static");
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
    };

    fetchData();
  }, [isFromMe, message]);

  return (
    <div className='h-96 w-44'>
      <Image src={imageUrl || '/placeholders/placeholder-image.svg'} alt={'broken image'} fill objectFit='cover' />
    </div>
  );
}


const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message }) => {
  return (
    <div>
      other Files
    </div>
  )
}



const TextMessagePreview: FC<IMessageBubblePreview> = ({ message }) => {
  return (
    message?.content
  )
}

