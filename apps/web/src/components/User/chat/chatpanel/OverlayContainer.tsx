import React, { FC, useEffect, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { slideUpAnimation } from '@/animation/slide-up-Animation';
import { useFilesContext } from '@/global/context/filesContext';
import { FilesActionType } from '@/global/context/reducers/filesReducer';
import MessageInput from '@/Atoms/Input/MessageInput';
import FilePreview from './Overlays/FilePreview';
import SelectedFiles, { SelectedFileType } from './SelectedFiles';
import { getFileUrl } from '@/utils/getFileUrl';

interface IOverlayContainer {
  parentRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

const OverlayContainer: FC<IOverlayContainer> = ({ parentRef, isOpen, onClose }) => {
  const { state, dispatch } = useFilesContext();

  const [loadedFiles, setLoadedFiles] = useState<SelectedFileType[]>([]);
  console.log('🚀 ~ loadedFiles:', loadedFiles);

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.position = 'relative';
    }
  }, [parentRef]);

  useEffect(() => {
    if (state.files) {
      for (const file of state.files) {
        const { type, url } = getFileUrl(file.file);
        setLoadedFiles((prev) => {
          return [...prev, { id: file.id, type, url, name: file.file.name }];
        });
      }
    }
  }, [state]);

  const handleOnClose = () => {
    onClose();
    dispatch({ type: FilesActionType.Reset });
    setLoadedFiles([]);
  };

  return (
    <AnimatePresence key={'overlay-container'}>
      {isOpen ? (
        <motion.div
          {...slideUpAnimation}
          className={`bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg absolute z-20 flex h-full w-full flex-col overflow-hidden px-2`}
        >
          {/* header */}
          <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text relative flex h-11 flex-shrink-0 place-items-center justify-between px-4 py-2">
            <OptionIcon src="/icons/x.svg" onClick={handleOnClose} />
            <span className="flex flex-shrink-0 flex-grow justify-center">{state.fileToPreview.name ? state.fileToPreview.name : 'Selected File'}</span>
          </span>

          {/* body */}
          <div className="h-full w-full">
            <FilePreview {...state.fileToPreview} />
          </div>
          <div className="mx-auto my-2 w-[70%]">
            <MessageInput placeholder="Type message" />
          </div>
          <SelectedFiles files={loadedFiles} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default OverlayContainer;
