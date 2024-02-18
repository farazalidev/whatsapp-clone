import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { expectedFileTypes } from '@shared/types';

export type filesFromType = 'document' | 'videos&photos' | 'sticker';

export type fileToPreviewType = {
  url: string | undefined;
  type: expectedFileTypes;
  id: string | null;
  name: string | null;
  size: number;
  attachedMessage: string | null;
};

export type IFiles = { file: File; id: string }[];

export type IFilesSliceInitialState = {
  from: filesFromType | null;
  loadedFiles: SelectedFileType[];
  files: IFiles;
  fileToPreview: fileToPreviewType;
};

export const initialState: IFilesSliceInitialState = {
  from: null,
  files: [],
  loadedFiles: [],
  fileToPreview: { type: 'others', url: undefined, id: null, name: null, size: 0, attachedMessage: null },
};

export const filesSlice = createSlice({
  name: 'files_slice',
  initialState,
  reducers: {
    addFiles: (state, { payload }: { payload: AddFilePayload }) => {
      const newFiles: IFiles = [];
      if (payload.files) {
        Array.from(payload.files).map((file) => {
          newFiles.push({ file, id: v4() });
        });
      }
      return {
        ...state,
        from: payload.from,
        files: newFiles,
      };
    },
    addMoreFiles: (state, { payload }: { payload: FileList | null }) => {
      const moreFiles: IFiles = [];
      if (payload) {
        Array.from(payload).map((file) => moreFiles.push({ file, id: v4() }));
      }
      return {
        ...state,
        files: [...state.files, ...moreFiles],
      };
    },
    addLoadedFiles: (state, { payload }: { payload: AddLoadedFilesPayload }) => {
      return {
        ...state,
        loadedFiles: payload.loadedFiles,
      };
    },
    addAttachedMessage: (state, { payload }: { payload: string }) => {
      const foundedFile = state.loadedFiles.find((file) => file.id === state.fileToPreview.id);
      if (foundedFile) {
        foundedFile.attachedMessage = payload;
      }
    },
    resetFiles: (state) => {
      return {
        files: [],
        fileToPreview: { id: '', name: '', size: 0, type: 'others', url: undefined, attachedMessage: null },
        from: null,
        loadedFiles: [],
      };
    },
    addFileToPreview: (state, { payload }: { payload: fileToPreviewType }) => {
      return {
        ...state,
        fileToPreview: payload,
      };
    },
    addThumbnailPathOfLoadedFile: (state, { payload }: { payload: AddThumbnailPathOfLoadedFile }) => {
      const foundedFile = state.loadedFiles.find((file) => file.id === payload.id);
      if (foundedFile) {
        foundedFile.thumbnailPath = payload.path;
      }
    },
    removeFile: (state, { payload }: { payload: removeFilePayload }) => {
      const filteredLoadedFiles = state.loadedFiles.filter((loadedFile) => loadedFile.id !== payload.id);
      const firstLoadedFile = filteredLoadedFiles[0];

      // If the removing file is in the preview
      let newFileToPreview = state.fileToPreview;
      if (state.fileToPreview.id === payload.id) {
        newFileToPreview = {
          ...firstLoadedFile,
          name: firstLoadedFile.file.name,
          size: firstLoadedFile.file.size,
          attachedMessage: firstLoadedFile.attachedMessage as any,
          url: URL.createObjectURL(firstLoadedFile.file),
        };
        state.fileToPreview = newFileToPreview;
      }

      state.loadedFiles = filteredLoadedFiles;
    },
  },
});

export const { addFiles, removeFile, resetFiles, addLoadedFiles, addFileToPreview, addAttachedMessage, addMoreFiles, addThumbnailPathOfLoadedFile } =
  filesSlice.actions;

export interface AddFilePayload {
  from: filesFromType;
  files: FileList | null;
}

export type removeFilePayload = {
  id: string;
};

export interface AddLoadedFilesPayload {
  loadedFiles: SelectedFileType[];
}

export interface AddThumbnailPathOfLoadedFile {
  id: string;
  path: string;
}
