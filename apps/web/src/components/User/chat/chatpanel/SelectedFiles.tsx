import SendMediaMessagesButton from '@/Atoms/Button/SendMediaMessagesButton';
import { Thumbnail } from '@/components/Misc/Thumbnail';
import { addFileToPreview, addMoreFiles, fileToPreviewType } from '@/global/features/filesSlice';
import { RootState } from '@/global/store';
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expectedFileTypes } from '@shared/types';
import AddNewFileButton from '@/Atoms/Button/AddNewFileButton';
import { toast } from 'sonner';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import { closeOverlay } from '@/global/features/overlaySlice';
import { combineMediaWithMessages } from '@/utils/combineMediaWithMessages';
import useCurrentChat from '@/hooks/useCurrentChat';
import { addNewMessage } from '@/global/features/messagesSlice';

export interface SelectedFileType {
  id: string;
  file: File;
  type: expectedFileTypes;
  mime: string
  thumbnail?: string | Blob | undefined | null;
  url?: string | undefined;
  attachedMessage?: string | null
  thumbnailPath?: string
  width?: number | null
  height?: number | null
  original_name: string
  fileChecksum: string
  uploadedFileSize?: number
}

interface ISelectedFiles {
}

const SelectedFiles: FC<ISelectedFiles> = () => {

  const { raw_chat } = useCurrentChat()

  const { Me } = useSelector((state: RootState) => state.UserSlice)

  const { fileToPreview, loadedFiles } = useSelector((state: RootState) => state.filesSlice)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  const selectFileTOPreview = (fileToPreview: fileToPreviewType) => {
    dispatch(addFileToPreview({ ...fileToPreview }))

  };

  const handleSendMessages = async () => {
    try {
      setIsLoading(true)


      // adding media in local storage
      await mainDb.media.bulkAdd(loadedFiles)

      await Promise.all(loadedFiles.map(async (file) => {
        if (file.type === "image" || file.type === "svg" || file.type === "video") {
          if (file.type === "video") {
            await mainDb.offlineMedia.add({ file: file.thumbnail as Blob, id: file.id, mime: "image/png", type: "image" })
          } else {
            await mainDb.offlineMedia.add({ file: file.file, id: file.id, mime: file.mime, type: file.type })
          }
        }
      }))

      // combining media with message
      const mediaMessages = combineMediaWithMessages(loadedFiles, Me, raw_chat)

      // adding messages in local storage
      await mainDb.mediaMessages.bulkAdd(mediaMessages)

      mediaMessages.forEach(message => {
        dispatch(addNewMessage({ chat_id: raw_chat?.id, message: { ...message, } }))
      })

      dispatch(closeOverlay())

    } catch (error) {
      toast.error("Error While uploading Files", { position: "bottom-left" })
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
              onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url, attachedMessage: file?.attachedMessage as string })}
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


