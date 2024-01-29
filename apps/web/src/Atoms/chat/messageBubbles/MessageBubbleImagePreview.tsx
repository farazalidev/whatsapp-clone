import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types";
import { fetcher } from "@/utils/fetcher";
import { mainDb } from "@/utils/mainIndexedDB";
import Image from "next/image";
import { FC, useState, useEffect } from "react";
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper";
import MediaMessageStatus from "./MediaMessageStatus";
import { makeResumableUpload } from "@/utils/makeResumableUpload";
import CircularProgressBar from "@/Atoms/misc/RoundedProgressBar";

export const MessageBubbleImagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadLoadingProgress, setUploadLoadingProgress] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      // if we sended this media message
      if (isFromMe && message && message.media) {

        // if the image is less than 10 mb then we will simply upload it without resumable feature
        // but if the size is more than 10 mb then we will upload it in chunks, so that it can be easily resumable

        try {

          // Try to get the image from the local database
          const media = await mainDb.media.get(message.media.id);

          if (media?.file) {
            // if there is already a file in the local storage
            const blob = new Blob([media.file], { type: media.file.type });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            // If not found in the local database, fetch it from the network
            // TODO: if this media is sended from us, and it is not founded in localDB and server, then this message will be in DLQ.
            const blob = await fetcher(`api/file/get-attachment/${message.media.path}/${message.media.ext}`, undefined, "blob", "static");
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }

          await makeResumableUpload({
            media, message, progressCallback(progress) {
              setUploadLoadingProgress(progress)
            },
          })



        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
    };

    fetchData();
  }, [isFromMe, message]);

  return (
    <MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex justify-center place-items-center">
      <Image src={imageUrl || '/placeholders/placholder-image.png'} alt={message?.media?.type || "image"} fill objectPosition="cover" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900"></div>
      <CircularProgressBar percentage={uploadLoadingProgress} loading={false} />
      <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
    </MediaMessageBubbleWrapper>
  );
};
