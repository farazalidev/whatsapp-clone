import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

export type expectedFileTypes = 'image' | 'video' | 'pdf' | 'others' | 'svg' | null;

export type filesFromType = 'document' | 'videos&photos' | 'sticker';

export type fileToPreviewType = { url: string | undefined; type: expectedFileTypes; id: string | null; name: string | null; size: number };

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
  fileToPreview: { type: 'others', url: undefined, id: null, name: null, size: 0 },
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
    addLoadedFiles: (state, { payload }: { payload: AddLoadedFilesPayload }) => {
      return {
        ...state,
        loadedFiles: payload.loadedFiles,
      };
    },
    resetFiles: (state) => {
      return {
        files: [],
        fileToPreview: { id: '', name: '', size: 0, type: 'others', url: undefined },
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
    removeFile: (state, { payload }: { payload: removeFilePayload }) => {
      const filteredFiles = state.files.filter((file) => file.id !== payload.id);
      return {
        ...state,
        files: filteredFiles,
      };
    },
  },
});

export const { addFiles, removeFile, resetFiles, addLoadedFiles, addFileToPreview } = filesSlice.actions;

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
