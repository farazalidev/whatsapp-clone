import { v4 } from 'uuid';
import { ActionMap } from '../type';
export enum FilesActionType {
  Add_File = 'add_file',
  remove_File = 'remove_file',
  Reset = 'reset',
  selectFileToPreview = 'select_file_to_preview',
}

export type expectedFileTypes = 'image' | 'video' | 'pdf' | 'others' | 'svg' | null;

type filesFromType = 'document' | 'videos&photos' | 'sticker';

export type fileToPreviewType = { url: string | undefined; type: expectedFileTypes; id: string | null; name: string | null; size: number };

export type IFiles = { file: File; id: string }[];

export type fileStateType = {
  from: filesFromType | null;
  files: IFiles;
  fileToPreview: fileToPreviewType;
};

export const FilesContextInitialState: fileStateType = {
  from: null,
  files: [],
  fileToPreview: { type: 'others', url: undefined, id: null, name: null, size: 0 },
};

type FilePayload = {
  [FilesActionType.Add_File]: {
    from: filesFromType;
    file: File;
  };
  [FilesActionType.remove_File]: {
    id: string;
  };
  [FilesActionType.Reset]: undefined;
  [FilesActionType.selectFileToPreview]: fileToPreviewType;
};

export type FilesActionTypesMap = ActionMap<FilePayload>[keyof ActionMap<FilePayload>];

export const FilesReducer = (state: fileStateType, action: FilesActionTypesMap): fileStateType => {
  switch (action.type) {
    case FilesActionType.Add_File: {
      state.files.push({ file: action.payload.file, id: v4() });
      state.from = action.payload.from;
      return {
        ...state,
      };
    }
    case FilesActionType.remove_File: {
      const filteredFiles = state.files.filter((file) => file.id === action.payload.id);
      const newFileToPreview = filteredFiles[0];
      // const { type, url } = getFileUrl(newFileToPreview.file);
      return {
        files: filteredFiles,
        from: state.from,
        fileToPreview: { type: 'others', url: '', id: newFileToPreview.id, name: newFileToPreview.file.name, size: 0 },
      };
    }
    case FilesActionType.Reset: {
      return {
        files: [],
        from: null,
        fileToPreview: { type: null, url: undefined, id: null, name: null, size: 0 },
      };
    }
    case FilesActionType.selectFileToPreview: {
      return {
        files: [],
        from: null,
        fileToPreview: { type: action.payload.type, url: action.payload.url, id: action.payload.id, name: action.payload.name, size: action.payload.size },
      };
    }

    default:
      return { ...state };
  }
};
