import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import Image from "next/image"
import { FC, useMemo } from "react"
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper"
import MediaMessageStatus from "./MediaMessageStatus"
import CircularProgressBar from "@/Atoms/misc/RoundedProgressBar"
import { useDispatch } from "react-redux"
import { toggleGalleryOverlay } from "@/global/features/overlaySlice"
import { setActiveGalleryMedia } from "@/global/features/GallerySlice"
import useFetchMediaMessage from "@/hooks/useFetchMediaMessage"
import { calculateScaledDimensions } from "@/utils/calculateScaledDimensions"

export const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const dispatch = useDispatch()

  const { isLoading, thumbnailUrl, uploadProgress, isResumable } = useFetchMediaMessage({ isFromMe, message })
  console.log("🚀 ~ isResumable:", isResumable)

  const handleGalleryOverlay = (id: string | undefined) => {
    if (id) {
      dispatch(setActiveGalleryMedia(id))
    }
    dispatch(toggleGalleryOverlay())
  }

  const dimensions = useMemo(() => calculateScaledDimensions(message?.media?.width, message?.media?.height, 300, 400, 250, 300), [message?.media?.height, message?.media?.width])


  return (
    <>
      {<MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex place-items-center justify-center cursor-pointer" onClick={() => handleGalleryOverlay(message?.media?.id)} height={dimensions.height} width={dimensions.width}>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>

        {/* progress bar */}
        {uploadProgress === 100 ?
          <span className="z-10 w-14 h-14 absolute rounded-full bg-black bg-opacity-70 cursor-pointer flex place-items-center justify-center">
            <Image src={'/icons/play.svg'} width={30} height={30} alt="play" />
          </span> : uploadProgress && uploadProgress > 0 || !thumbnailUrl ? <CircularProgressBar loading={isLoading} percentage={uploadProgress} /> : null}

        {/* thumbnail */}
        {thumbnailUrl ? <Image src={thumbnailUrl} alt="video" layout="responsive" width={dimensions.width} height={dimensions.height} /> : null}

        <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
      </MediaMessageBubbleWrapper>}

    </>
  )
}

