import { Thumbnail } from '@/components/Misc/Thumbnail';
import VideoThumbnail from '@/components/Misc/VideoThumbnail';
import { useFilesContext } from '@/global/context/filesContext';
import { FilesActionType, fileToPreviewType } from '@/global/context/reducers/filesReducer';
import { GetFileUrlReturnType } from '@/utils/getFileUrl';
import React, { FC } from 'react';

export interface SelectedFileType extends GetFileUrlReturnType {
  id: string;
  name: string;
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
        return file.type === 'image' ? (
          <Thumbnail
            url={file.url}
            height={60}
            width={60}
            type="image"
            active={state.fileToPreview.id === file.id}
            onClick={() => selectFileTOPreview({ type: file.type, url: file.url, id: file.id, name: file.name, size: file.size })}
          />
        ) : file.type === 'video' ? (
          <VideoThumbnail
            videoUrl={file.url}
            height={60}
            width={60}
            snapShotAtTime={15}
            type="video"
            onClick={() => selectFileTOPreview({ type: file.type, url: file.url, id: file.id, name: file.name, size: file.size })}
            active={state.fileToPreview.id === file.id}
          />
        ) : (
          <Thumbnail
            height={60}
            width={60}
            type={null}
            url={undefined}
            active={file.id === state.fileToPreview.id}
            onClick={() => selectFileTOPreview({ type: file.type, url: file.url, id: file.id, name: file.name, size: file.size })}
          />
        );
      })}
    </div>
  );
};

export default SelectedFiles;
