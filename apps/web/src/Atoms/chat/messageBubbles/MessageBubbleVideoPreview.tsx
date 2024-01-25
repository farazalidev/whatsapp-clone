import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import { fetcher } from "@/utils/fetcher"
import { mainDb } from "@/utils/mainIndexedDB"
import Image from "next/image"
import { FC, useState, useEffect } from "react"
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper"

export const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)

  useEffect(() => {

    const fetchVideo = async () => {

      console.log(message);

      if (message?.media) {
        // get the thumbnail from local data base
        const result = await mainDb.media.get(message?.media.id)
        if (result?.thumbnail instanceof Blob) {
          const thumbnailUrl = URL.createObjectURL(result.thumbnail)
          setVideoThumbnail(thumbnailUrl)
        }

        if (result?.file) {
          const videoUrl = URL.createObjectURL(result?.file)
          setVideoUrl(videoUrl)

        }


      }

      const fetchedThumbnailBlob = await fetcher(`api/file/get-attachment/${message?.media?.path}/${message?.media?.ext}`, undefined, 'blob', "static")
      const videoThumbnailUrl = URL.createObjectURL(fetchedThumbnailBlob)
      setVideoThumbnail(videoThumbnailUrl)

      if (message?.media) {
        const video = await mainDb.media.get(message?.media.id)
        setVideoUrl(video?.url as string)

      }
      const videoBlob = await fetcher(`api/file/get-attachment-file/${message?.media?.id}/${message?.media?.ext}`)
      const video = URL.createObjectURL(videoBlob)
      setVideoUrl(video)


    }
    fetchVideo()

  }, [message?.media])

  return (
    <>
      {videoUrl ? <video /> : <MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} >
        {videoThumbnail ? <Image src={videoThumbnail} alt="video" fill objectFit="cover" /> : <Image src={'/placeholders/placholder-image.png'} alt="video" fill objectFit="cover" />}
      </MediaMessageBubbleWrapper>}

    </>
  )
}
