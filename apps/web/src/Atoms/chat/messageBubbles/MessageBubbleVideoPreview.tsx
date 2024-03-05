import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
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
import { mainDb } from "@/utils/indexedDb/mainIndexedDB"
import { sendMessageFn } from "@/utils/sendMessageFn"
import { MessageEntity } from "@server/modules/chat/entities/message.entity"

export const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const { socket } = useSocket();

  const { raw_chat } = useCurrentChat();

  const { Me } = useSelector((state: RootState) => state.UserSlice);

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
        const sended = await sendMessageFn({ message: messageToSend, socket })
        if (sended) {
          await mainDb.media.delete(message.media?.id as string)
          await mainDb.mediaMessages.delete(message.id)
        }
      }
    };
    return lastAction()
  }, [Me, message, raw_chat, socket])

  const dimensions = useMemo(() => calculateScaledDimensions(message?.media?.width, message?.media?.height, 300, 400, 200, 300), [message?.media?.height, message?.media?.width])

  const dispatch = useDispatch()

  const { thumbnailState } = useFetchMediaThumbnail({ isFromMe, message })

  const { cancel, retry, state } = useUpload({ isFromMe, message, lastAction })

  const handleGalleryOverlay = (id: string | undefined) => {
    if (id && message?.media) {
      dispatch(setActiveGalleryMedia({ ...message?.media, message: message }));
    }
    dispatch(toggleGalleryOverlay())
  }


  const handleRetry = () => {
    retry()
  }
  const handlePause = () => {
    cancel()
  }



  return (
    <>
      {<MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex place-items-center justify-center" height={dimensions.height} width={dimensions.width}>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>

        {/* progress bar */}
        <ProgressBar
          barStyle="circle"
          isResumable={state?.isResumable}
          isLoading={state?.isLoading}
          progress={state?.progress}
          showActionButton={true}
          messageType={message?.messageType}
          onRetryClick={handleRetry}
          onPauseClick={handlePause}
          onActionButtonClick={() => handleGalleryOverlay(message?.media?.id)}
          isFromMe={isFromMe}
          className="absolute"
        />

        {/* thumbnail */}
        {thumbnailState.thumbnail ? <span style={{ width: "100%", height: "100%", backgroundImage: `url(${thumbnailState.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }} className="" /> : null}

        <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
      </MediaMessageBubbleWrapper>}

    </>
  )
}

