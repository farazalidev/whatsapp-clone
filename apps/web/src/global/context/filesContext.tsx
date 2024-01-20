'use client';
import React, { FC, ReactNode, createContext, useContext, useReducer } from 'react';
import { FilesActionTypesMap, FilesContextInitialState, FilesReducer, fileStateType } from './reducers/filesReducer';

const FilesContext = createContext<{ state: fileStateType; dispatch: React.Dispatch<FilesActionTypesMap> }>({
  state: FilesContextInitialState,
  dispatch: () => null,
});

interface IFilesContext {
  children: ReactNode;
}

const FilesContextProvider: FC<IFilesContext> = ({ children }) => {
  const [state, dispatch] = useReducer(FilesReducer, FilesContextInitialState);

  return <FilesContext.Provider value={{ state, dispatch }}>{children}</FilesContext.Provider>;
};

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileContextProvider');
  }
  return context;
};

export default FilesContextProvider;
