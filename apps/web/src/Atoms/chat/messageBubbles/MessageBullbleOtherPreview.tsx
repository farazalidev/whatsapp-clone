import { IMessageBubblePreview } from "@/Atoms/types/messageBubble.types"
import { FC, useEffect, useState } from "react"
import MediaMessageStatus from "./MediaMessageStatus"
import Image from "next/image"
import { convertFileSizeFromBytes } from "@/utils/getFIleSizeFromBytes"
import { clampString } from "@/utils/clamp"
import { IPerformAction, ResumableUpload } from "@/utils/resumeableUpload-alpha"
import { mainDb } from "@/utils/mainIndexedDB"
import ProgressBar from "@/Atoms/misc/ProgressBar"
import { fetcher } from "@/utils/fetcher"

export const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message, messageLines, isFromMe }) => {

  const [uploadManager, setUploadManager] = useState<ResumableUpload | undefined>()

  const [state, setState] = useState<{ progress: number, isLoading: boolean }>()

  useEffect(() => {

    const getManager = async () => {
      // first of all we have to check that if the file is available on server or not
      // if the file exists then return
      // if the file does not then check inside the indexed db , if the file
      // founded inside the indexed db then we will upload it if not then this message will be added to DLQ
      const isFileAvailableOnServer = await fetcher(`api/file/is-attachment-existed/${message?.media?.id}${message?.media?.ext}`, undefined, "json", "static")

      if (isFileAvailableOnServer) {
        setState({ isLoading: false, progress: 100 })
        return
      }

      // if the file is not available on the server
      else {

        // if we have message media
        if (message?.media) {

          const file = await mainDb.media.get(message?.media?.id)

          // if we have file in indexed db
          if (file) {
            const onProgress = (progress: number, isLoading: boolean) => {
              setState(prev => { return { ...prev, progress, isLoading } })

            }
            const performAction: IPerformAction = async ({ chunksUploaded }) => {
              await mainDb.mediaMessages.update(message?.id, { media: { ...message.media, chunksUploaded } });
            }
            const manager = new ResumableUpload({ file: file.file, file_name: message?.media?.id, onProgress, performAction, startByte: 0 })
            setUploadManager(manager)

          }
        }

        // if the file is not on server and local db then add this message to DLQ
        // TODO: DLQ implementation

      }

    }

    if (isFromMe) {
      getManager()

    }

  }, [message, isFromMe])



  // manual upload
  const handleRetry = () => {
    console.log('upload clicked');

    if (uploadManager) {
      uploadManager.uploadChunk()
    }
  }


  const handlePause = () => {
    console.log('pause clicked');

    uploadManager?.cancel()
  }

  const handleDownload = () => {
    console.log('download clicked');

  }


  return (
    <div className="w-[350px] h-[100px] rounded-md bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark p-1 flex flex-col" >
      <div className="bg-black bg-opacity-20 flex-1/3 h-full rounded-md flex justify-between place-items-center px-2">
        <div className="flex gap-2 place-items-center" >
          <Image src={'/icons/preview-generic.svg'} width={40} height={50} alt="file" />
          <div className="flex flex-col gap-2 text-white text-opacity-80">
            <span className="text-sm line-clamp-1">{clampString(message?.media?.original_name || "file", 25)}</span>
            <span className="text-xs text-[#86a3b3] flex gap-1">
              <span>{message?.media?.ext}</span>
              <span>{convertFileSizeFromBytes(message?.media?.size || 0, "•")}</span>
            </span>
          </div>
        </div>
        <span className="flex justify-center place-items-center">
          {/* progress bar */}
          <ProgressBar barStyle="circle" isLoading={state?.isLoading} progress={state?.progress || 0} showDownloadButton onRetryClick={handleRetry} onPauseClick={handlePause} onDownloadClick={handleDownload} />
        </span>
      </div>
      {isFromMe ?
        <div className="flex-1/3 h-[30%] relative">
          <MediaMessageStatus isFromMe={isFromMe} message={message} messageLines={messageLines} />
        </div> : null}
    </div>
  )
}
