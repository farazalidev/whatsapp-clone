import { v4 } from 'uuid';
import { ActionMap } from '../type';
export enum FilesActionType {
  Add_File = 'add_file',
  remove_File = 'remove_file',
  Reset = 'reset',
}

type filesFromType = 'document' | 'videos&photos' | 'sticker';

export type fileStateType = {
  from: filesFromType | null;
  files: { file: File; id: string }[];
};

export const FilesContextInitialState: fileStateType = {
  from: null,
  files: [],
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
      return {
        files: filteredFiles,
        from: state.from,
      };
    }
    case FilesActionType.Reset: {
      return {
        files: [],
        from: null,
      };
    }

    default:
      return { ...state };
  }
};
