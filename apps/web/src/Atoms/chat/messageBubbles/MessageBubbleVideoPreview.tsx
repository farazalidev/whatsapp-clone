import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import { fetcher } from "@/utils/fetcher"
import { mainDb } from "@/utils/mainIndexedDB"
import Image from "next/image"
import { FC, useState, useEffect } from "react"
import MediaMessageBubbleWrapper from "./MediaMessageBubbleWrapper"
import MediaMessageStatus from "./MediaMessageStatus"
import CircularProgressBar from "@/Atoms/misc/RoundedProgressBar"
import { IProgressCallback, resumableUpload } from "@/utils/resumeableUpload"
import { sendMessageFn } from "@/utils/sendMessageFn"
import useSocket from "@/hooks/useSocket"
import { useSelector } from "react-redux"
import { RootState } from "@/global/store"

export const MessageBubbleVideoPreview: FC<IMessageBubblePreview> = ({ message, isFromMe }) => {

  const [loading, setLoading] = useState(true)

  const [uploadProgress, setUploadProgress] = useState(1)

  const [mediaState, setMediaState] = useState<{ isResumable: boolean, videoUrl: string | null, videoThumbnail: string | null }>({ isResumable: false, videoThumbnail: null, videoUrl: null })

  const { socket } = useSocket()
  const chatSlice = useSelector((state: RootState) => state.ChatSlice)

  useEffect(() => {

    const fetchVideoAndUpload = async () => {
      // First of all if the message is sended from our side then we will load the video and video thumbnail from local db
      // when the media message first mount then we will check from the server that the media is available or not
      // while we will show a loading bar
      // if the media is not available then we will and the uploaded chunks are 0 then we will automatically start to
      // make resumable upload. If the media not found on server and uploaded chunks are less than total chunks then we will
      // show a button to the user to resume the upload or not
      // if the user resume the upload the we will resume the upload, while uploading we will update the message state in the local storage

      try {

        if (isFromMe && message && message.media) {
          // checking media availability in the server
          const localDbMedia = await mainDb.media.get(message?.media.id)

          // getting vide thumbnail form local db
          const videoThumbnail = URL.createObjectURL(localDbMedia?.thumbnail as Blob)
          if (videoThumbnail) {
            setMediaState(prev => { return { ...prev, videoThumbnail } })
          }


          const isAttachmentExisted = await fetcher<boolean>(`api/file/is-attachment-existed/${message?.media?.id}/${message?.media?.ext}`, undefined, "json", "static")
          // if media is not available on server and localMedia message uploaded chunks are 0 then automatically upload the media
          console.log("🚀 ~ fetchVideoAndUpload ~ isAttachmentExisted:", isAttachmentExisted)
          if (!isAttachmentExisted && message?.media && message?.media?.chunksUploaded === 0 && localDbMedia) {
            // setting loading to be false to show the upload progress
            setLoading(false)
            const progressCallback: IProgressCallback = async (progress, totalChunks, chunksUploaded) => {
              // setting upload progress
              setUploadProgress(progress)
              await mainDb.mediaMessages.update(message?.id, { media: { ...message.media, chunksUploaded } })
            }
            await resumableUpload(localDbMedia, message.media.chunksUploaded, progressCallback)

            const messageToSend = await mainDb.mediaMessages.get(message.id)
            if (messageToSend) {
              await sendMessageFn({ chatSlice, socket, receiver_id: chatSlice.receiver_id as string, message: { ...messageToSend, messageType: "video" } })

            }
          }

          // if the attachment is not existed on server and uploaded chunks are more that 0, means that the user first started uploading
          // but it was failed, then we will show the user a upload button to resume it manually
          else if (!isAttachmentExisted && message?.media?.chunksUploaded && message?.media?.chunksUploaded > 0) {
            setMediaState(prev => { return { ...prev, isResumable: true } })
          }

          setUploadProgress(100)
          setLoading(false)


        }

        // // if the media message is not from me
        // if(!isFromMe){

        // }

      }
      catch (error) {
        console.log(error);

      }
    }

    fetchVideoAndUpload()

  }, [message, isFromMe])



  return (
    <>
      {<MediaMessageBubbleWrapper isFromMe={isFromMe} messageType={message?.messageType} className="flex place-items-center justify-center">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
        {uploadProgress === 100 ?
          <span className="z-10 w-14 h-14 relative rounded-full bg-black bg-opacity-70 cursor-pointer flex place-items-center justify-center">
            <Image src={'/icons/play.svg'} width={30} height={30} alt="play" />
          </span> : <CircularProgressBar loading={loading} percentage={uploadProgress} />}
        {mediaState.videoThumbnail ? <Image src={mediaState.videoThumbnail} alt="video" fill objectFit="cover" /> : <Image src={'/placeholders/placholder-image.png'} alt="video" fill objectFit="cover" />}
        <MediaMessageStatus isFromMe={isFromMe} message={message} key={message?.id} />
      </MediaMessageBubbleWrapper>}

    </>
  )
}

