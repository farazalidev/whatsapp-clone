import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import Image from "next/image"
import { FC, useCallback, useMemo } from "react"
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper"
import MediaMessageStatus from "./MediaMessageStatus"
import { useDispatch, useSelector } from "react-redux"
import { toggleGalleryOverlay } from "@/global/features/overlaySlice"
import { setActiveGalleryMedia } from "@/global/features/GallerySlice"
import { calculateScaledDimensions } from "@/utils/calculateScaledDimensions"
import useUpload from "@/hooks/useUpload"
import ProgressBar from "@/Atoms/misc/ProgressBar"
import { useFetchMediaThumbnail } from "@/hooks/useFetchMediaThumbnail"
import { RootState } from "@/global/store"
import useCurrentChat from "@/hooks/useCurrentChat"
import useSocket from "@/hooks/useSocket"
import { mainDb } from "@/utils/mainIndexedDB"
import { sendMessageFn } from "@/utils/sendMessageFn"
import { MessageEntity } from "@server/modules/chat/entities/message.entity"

export const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const chatSlice = useSelector((state: RootState) => state.ChatSlice);

  const { socket } = useSocket();

  const { raw_chat } = useCurrentChat();

  const { Me } = useSelector((state: RootState) => state.UserSlice);

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
        const sended = await sendMessageFn({ chatSlice, message: messageToSend, receiver_id: chatSlice.receiver_id as string, socket })
        if (sended) {
          await mainDb.media.delete(message.media?.id as string)
          await mainDb.mediaMessages.delete(message.id)
        }
      }
    };
    return lastAction()
  }, [Me, chatSlice, message, raw_chat, socket])

  const dimensions = useMemo(() => calculateScaledDimensions(message?.media?.width, message?.media?.height, 300, 400, 200, 300), [message?.media?.height, message?.media?.width])

  const dispatch = useDispatch()

  const { thumbnailState } = useFetchMediaThumbnail({ isFromMe, message })

  const { cancel, download, retry, state } = useUpload({ isFromMe, message, lastAction })

  const handleGalleryOverlay = (id: string | undefined) => {
    if (id) {
      dispatch(setActiveGalleryMedia(id))
    }
    dispatch(toggleGalleryOverlay())
  }


  const handleRetry = () => {
    retry()
  }
  const handlePause = () => {
    cancel()
  }
  const handleDownload = () => {
    download()
  }



  return (
    <>
      {<MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex place-items-center justify-center cursor-pointer" onClick={() => handleGalleryOverlay(message?.media?.id)} height={dimensions.height} width={dimensions.width}>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>

        {/* progress bar */}
        <span className="absolute">
          <ProgressBar
            barStyle="circle"
            isResumable={state?.isResumable}
            isLoading={state?.isLoading}
            progress={state?.progress}
            showActionButton={true}
            messageType={message?.messageType}
            onRetryClick={handleRetry}
            onPauseClick={handlePause}
            onActionButtonClick={handleDownload}
          /> </span>

        {/* thumbnail */}
        {thumbnailState.thumbnail ? <Image src={thumbnailState.thumbnail} loading="lazy" alt="video" className="blur-[2px]" fill /> : null}

        <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
      </MediaMessageBubbleWrapper>}

    </>
  )
}

