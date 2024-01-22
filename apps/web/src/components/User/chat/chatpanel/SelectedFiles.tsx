import SendMediaMessagesButton from '@/Atoms/Button/SendMediaMessagesButton';
import { Thumbnail } from '@/components/Misc/Thumbnail';
import { addFileToPreview, addMoreFiles, fileToPreviewType } from '@/global/features/filesSlice';
import { RootState } from '@/global/store';
import React, { ChangeEvent, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expectedFileTypes } from '@shared/types';
import AddNewFileButton from '@/Atoms/Button/AddNewFileButton';

export interface SelectedFileType {
  id: string;
  file: File;
  type: expectedFileTypes;
  thumbnailUrl: string | undefined | null;
  url: string | undefined;
  attachedMessage: string | null
}

interface ISelectedFiles {
  files: SelectedFileType[];
}

const SelectedFiles: FC<ISelectedFiles> = ({ files }) => {
  const { fileToPreview, files: selectedFiles, loadedFiles } = useSelector((state: RootState) => state.filesSlice)
  const dispatch = useDispatch()

  const selectFileTOPreview = (fileToPreview: fileToPreviewType) => {
    dispatch(addFileToPreview({ ...fileToPreview }))

  };

  const handleSendMessages = () => {
    console.log(loadedFiles);

  }
  const handleAddFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      dispatch(addMoreFiles(e.target.files))
    }
  }

  return (
    <div className='flex place-items-start gap-2 py-2 px-3' >
      <div className="relative flex place-items-center w-full gap-2 overflow-y-scroll scrollbar">
        {files.map((file) => {
          return (
            <Thumbnail
              id={file.id}
              key={file.id}
              height={50}
              width={50}
              type={file.type}
              url={file.type === 'video' ? (file.thumbnailUrl as string) : file.url}
              active={fileToPreview.id === file.id}
              onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url, attachedMessage: file.attachedMessage })}
            />
          );
        })}
      </div>
      <div className='flex place-items-center gap-2 '>
        <AddNewFileButton onChange={handleAddFileChange} />
        <SendMediaMessagesButton count={selectedFiles.length} onClick={handleSendMessages} />
      </div>
    </div>
  );
};

export default SelectedFiles;


