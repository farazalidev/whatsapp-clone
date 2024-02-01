import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import { FC } from "react"
import MediaMessageStatus from "./MediaMessageStatus"
import Image from "next/image"
import { convertFileSizeFromBytes } from "@/utils/getFIleSizeFromBytes"
import useFetchMediaMessage from "@/hooks/useFetchMediaMessage"
import CircularProgressBar from "@/Atoms/misc/RoundedProgressBar"

export const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message, messageLines, isFromMe }) => {
  const { isLoading, uploadProgress } = useFetchMediaMessage({ isFromMe, message })

  return (
    <div className="w-[350px] h-[100px] rounded-md bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark p-1 flex flex-col">
      <div className="bg-black bg-opacity-20 flex-1/3 h-full rounded-md flex justify-between place-items-center px-2">
        <div className="flex gap-2 place-items-center">
          <Image src={'/icons/preview-generic.svg'} width={40} height={50} alt="file" />
          <div className="flex flex-col gap-2 text-white text-opacity-80">
            <span className="text-sm line-clamp-1 ">{message?.media?.original_name}</span>
            <span className="text-xs text-[#86a3b3] flex gap-1">
              <span>{message?.media?.ext}</span>
              <span>{convertFileSizeFromBytes(message?.media?.size || 0, "•")}</span>
            </span>
          </div>
        </div>
        <span>
          {uploadProgress === 100 ? <Image src={'/icons/gallery-icons/download.svg'} alt="download" height={50} width={40} /> :
            <CircularProgressBar loading={isLoading} percentage={uploadProgress} />}

        </span>
      </div>
      {isFromMe ?
        <div className="flex-1/3 h-[30%] relative">
          <MediaMessageStatus isFromMe={isFromMe} message={message} messageLines={messageLines} />
        </div> : null}
    </div>
  )
}
