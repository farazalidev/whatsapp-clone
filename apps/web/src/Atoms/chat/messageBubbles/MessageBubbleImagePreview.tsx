import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types";
import Image from "next/image";
import { FC, useMemo, } from "react";
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper";
import MediaMessageStatus from "./MediaMessageStatus";
import CircularProgressBar from "@/Atoms/misc/RoundedProgressBar";
import useFetchMediaMessage from "@/hooks/useFetchMediaMessage";
import { calculateScaledDimensions } from "@/utils/calculateScaledDimensions";

export const MessageBubbleImagePreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const { isLoading, thumbnailUrl, uploadProgress } = useFetchMediaMessage({ isFromMe, message, })

  const dimensions = useMemo(() => calculateScaledDimensions(message?.media?.width, message?.media?.height, 400, 400, 300, 300), [message?.media?.height, message?.media?.width])

  return (
    <MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex justify-center place-items-center" height={dimensions.height} width={dimensions.width}>
      {thumbnailUrl ? <Image src={thumbnailUrl} alt={message?.media?.type || "image"} layout="responsive" width={dimensions.width} height={dimensions.height} /> : null}

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900"></div>
      {uploadProgress === 100 ?
        null : uploadProgress && uploadProgress > 0 || !thumbnailUrl ? <CircularProgressBar loading={isLoading} percentage={uploadProgress} /> : null}
      <div className="z-10 absolute bottom-1 left-1">{message?.content}</div>
      <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
    </MediaMessageBubbleWrapper>
  );
};
