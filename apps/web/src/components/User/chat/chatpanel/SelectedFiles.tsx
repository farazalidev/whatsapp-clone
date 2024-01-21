import { Thumbnail } from '@/components/Misc/Thumbnail';
import { expectedFileTypes, fileToPreviewType } from '@/global/context/reducers/filesReducer';
import { addFileToPreview } from '@/global/features/filesSlice';
import { RootState } from '@/global/store';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export interface SelectedFileType {
  id: string;
  file: File;
  type: expectedFileTypes;
  thumbnailUrl: string | undefined | null;
  url: string | undefined;
}

interface ISelectedFiles {
  files: SelectedFileType[];
}

const SelectedFiles: FC<ISelectedFiles> = ({ files }) => {
  const { fileToPreview } = useSelector((state: RootState) => state.filesSlice)
  const dispatch = useDispatch()

  const selectFileTOPreview = (fileToPreview: fileToPreviewType) => {
    dispatch(addFileToPreview({ ...fileToPreview }))
  };

  return (
    <div className="flex h-28 place-items-center w-[90%] gap-2 overflow-y-auto shadow-xl">
      {files.map((file) => {
        return (
          <Thumbnail
            id={file.id}
            key={file.id}
            height={60}
            width={60}
            type={file.type}
            url={file.type === 'video' ? (file.thumbnailUrl as string) : file.url}
            active={fileToPreview.id === file.id}
            onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url })}
          />
        );
      })}
    </div>
  );
};

export default SelectedFiles;
