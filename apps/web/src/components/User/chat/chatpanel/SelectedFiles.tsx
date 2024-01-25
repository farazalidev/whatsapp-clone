import SendMediaMessagesButton from '@/Atoms/Button/SendMediaMessagesButton';
import { Thumbnail } from '@/components/Misc/Thumbnail';
import { addFileToPreview, addMoreFiles, addThumbnailPathOfLoadedFile, fileToPreviewType } from '@/global/features/filesSlice';
import { RootState } from '@/global/store';
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expectedFileTypes } from '@shared/types';
import AddNewFileButton from '@/Atoms/Button/AddNewFileButton';
import { Mutation } from '@/utils/fetcher';
import { getImagesAndVideosFromLoadedFiles } from '@/utils/getImagesAndVideosFromLoadedFiles';
import { toast } from 'sonner';
import { mainDb } from '@/utils/mainIndexedDB';
import { closeOverlay } from '@/global/features/overlaySlice';
import { sendMessageFn } from '@/utils/sendMessageFn';
import useSocket from '@/hooks/useSocket';
import { v4 } from 'uuid';
import { extname } from 'path';
import { combineMediaWithMessages } from '@/utils/combineMediaWithMessages';
import useCurrentChat from '@/hooks/useCurrentChat';

export interface SelectedFileType {
  id: string;
  file: File;
  type: expectedFileTypes;
  thumbnail: string | Blob | undefined | null;
  url: string | undefined;
  attachedMessage: string | null
  thumbnailPath?: string
}

interface ISelectedFiles {
}

const SelectedFiles: FC<ISelectedFiles> = () => {
  const { socket } = useSocket()

  const chatSlice = useSelector((state: RootState) => state.ChatSlice)

  const { chat, raw_chat } = useCurrentChat()

  const { Me } = useSelector((state: RootState) => state.UserSlice)

  const { fileToPreview, loadedFiles } = useSelector((state: RootState) => state.filesSlice)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const selectFileTOPreview = (fileToPreview: fileToPreviewType) => {
    dispatch(addFileToPreview({ ...fileToPreview }))

  };

  const handleSendMessages = async () => {
    console.log(loadedFiles);

    // Before uploading files we will generate all images thumbnails or we have to upload
    // the generated videos thumbnails to the server, so that we can show the file thumbnails,
    // After the thumbnails successfully generated, then we have to save all the loaded files into
    // the indexedDB, so that if there was an error while uploading the file or the user internet goes off
    // or any interruption we got, we would have a copy of all that files with, and we will also have the file
    // relative path so that if the user intentionally or unintentionally deleted the indexedDB, we will ask the user
    // to get that images again from his computer to again upload, so before uploading we will process all of these
    // things.



    try {
      setIsLoading(true)

      // getting images and videos from loaded files
      const imageFiles = getImagesAndVideosFromLoadedFiles(loadedFiles)

      // uploading all the thumbnails of the loaded images and videos and saving the server file paths
      imageFiles.forEach(async (file) => {
        // if we have video
        if (file.thumbnail && file.type === "video") {
          const fmData = new FormData()
          fmData.append("attachment-thumbnail", file.thumbnail as Blob, `${file.id}.png`)

          const response = await Mutation<FormData, { filePath: string }>("api/file/upload-thumbnail", fmData, "static", { headers: { file_name: file.id } })
          dispatch(addThumbnailPathOfLoadedFile({ id: file.id, path: response.filePath }))

        }

        // saving loaded files into indexed db
      })

      await mainDb.media.bulkAdd(loadedFiles)

      // before saving the message into the database, save the file in the server, and then process the message

      const mediaMessages = combineMediaWithMessages(loadedFiles, Me, raw_chat)
      console.log("🚀 ~ handleSendMessages ~ mediaMessages:", mediaMessages)

      await mainDb.mediaMessages.bulkAdd(mediaMessages)


      // registering messages in the data base
      // // TODO: implement message send functionality...
      // await sendMessageFn({ chatSlice, Me, socket, messageValue: "", receiver_id: "" })
      // dispatch(closeOverlay())



    } catch (error) {
      toast.error("Error While uploading Files", { position: "top-center" })
    } finally {
      setIsLoading(false)
    }

    // sending media messages


  }
  const handleAddFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatch(addMoreFiles(e.target.files))
    }
  }

  return (
    <div className='flex place-items-start gap-2 py-2 px-3' >
      <div className="relative flex place-items-center w-full gap-2 overflow-y-scroll scrollbar">
        {loadedFiles.map((file) => {
          return (
            <Thumbnail
              id={file.id}
              key={file.id}
              height={50}
              width={50}
              type={file.type}
              url={file.type === 'video' ? (file.thumbnail as string) : file.url}
              active={fileToPreview.id === file.id}
              onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url, attachedMessage: file.attachedMessage })}
            />
          );
        })}
      </div>
      <div className='flex place-items-center gap-2 '>
        <AddNewFileButton onChange={handleAddFileChange} />
        <SendMediaMessagesButton count={loadedFiles.length} onClick={handleSendMessages} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SelectedFiles;


