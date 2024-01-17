import { Thumbnail } from '@/components/Misc/Thumbnail';
import { useFilesContext } from '@/global/context/filesContext';
import { FilesActionType, expectedFileTypes, fileToPreviewType } from '@/global/context/reducers/filesReducer';
import React, { FC } from 'react';

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
  const { dispatch, state } = useFilesContext();

  const selectFileTOPreview = ({ type, url, id, name, size }: fileToPreviewType) => {
    dispatch({ type: FilesActionType.selectFileToPreview, payload: { type, url, id, name, size } });
  };

  return (
    <div className="flex h-28 w-full place-items-center justify-center gap-2">
      {files.map((file) => {
        return (
          <Thumbnail
            key={file.id}
            height={60}
            width={60}
            type={file.type}
            url={file.type === 'image' ? file.url : (file.thumbnailUrl as string)}
            active={state.fileToPreview.id === file.id}
            onClick={() => selectFileTOPreview({ id: file.id, name: file.file.name, size: file.file.size, type: file.type, url: file.url })}
          />
        );
      })}
    </div>
  );
};

export default SelectedFiles;
