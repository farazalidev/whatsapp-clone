import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types";
import OptionIcon from "@/components/User/Sidebar/OptionIcon";
import { fetcher } from "@/utils/fetcher";
import { mainDb } from "@/utils/mainIndexedDB";
import dayjs from "dayjs";
import Image from "next/image";
import { FC, useState, useEffect } from "react";
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper";

export const MessageBubbleImagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (isFromMe && message && message.media) {
        try {
          // Try to get the image from the local database
          const media = await mainDb.media.get(message.media.id);
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
    <MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} >
      <Image src={imageUrl || '/placeholders/placholder-image.png'} alt={'broken image'} fill objectPosition="cover" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900"></div>
      {isFromMe ? (
        <span className={`flex place-items-center justify-evenly gap-1 pl-1  absolute bottom-0 right-0 mt-4'`}>
          <span className="mt-1 flex text-[10px] text-white text-opacity-70">{message?.sended_at ? dayjs(message.sended_at).format('hh:mm A') : ''}</span>
          <span className="flex place-items-center px-1 py-[2px]">
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
    </MediaMessageBubbleWrapper>
  );
};
