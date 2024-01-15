import React, { FC, useEffect, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { slideUpAnimation } from '@/animation/slide-up-Animation';
import { useFilesContext } from '@/global/context/filesContext';
import { FilesActionType } from '@/global/context/reducers/filesReducer';
import MessageInput from '@/Atoms/Input/MessageInput';
import FilePreview from './Overlays/FilePreview';
import SelectedFiles, { SelectedFileType } from './SelectedFiles';

interface IOverlayContainer {
  parentRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
  headerTitle?: string;
}

const OverlayContainer: FC<IOverlayContainer> = ({ parentRef, isOpen, onClose, headerTitle }) => {
  const { state, dispatch } = useFilesContext();

  const [loadedImages, setLoadedImages] = useState<SelectedFileType[]>([]);
  console.log('🚀 ~ loadedImages:', loadedImages);

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.position = 'relative';
    }
  }, [parentRef]);

  useEffect(() => {
    if (state.files) {
      for (const file of state.files) {
        const url = URL.createObjectURL(file.file);
        setLoadedImages((prev) => {
          return [...prev, { type: file.file.type.startsWith('image/') ? 'image' : 'video', url, id: file.id }];
        });
      }
    }
  }, [state]);

  const handleOnClose = () => {
    onClose();
    dispatch({ type: FilesActionType.Reset });
  };

  return (
    <AnimatePresence key={'overlay-container'}>
      {isOpen ? (
        <motion.div
          {...slideUpAnimation}
          className={`bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg absolute z-20 flex h-full w-full flex-col overflow-hidden border`}
        >
          {/* header */}
          <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text relative flex h-11 flex-shrink-0 place-items-center justify-between px-4 py-2">
            <OptionIcon src="/icons/x.svg" onClick={handleOnClose} />
            <span className="flex flex-shrink-0 flex-grow justify-center">{headerTitle ? headerTitle : 'Title'}</span>
          </span>

          {/* body */}
          <FilePreview />
          <div className="mx-auto w-[70%]">
            <MessageInput placeholder="Type message" />
          </div>
          <SelectedFiles files={loadedImages} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default OverlayContainer;
