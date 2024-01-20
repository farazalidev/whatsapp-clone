import React, { FC, useEffect, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { slideUpAnimation } from '@/animation/slide-up-Animation';
import { useFilesContext } from '@/global/context/filesContext';
import { FilesActionType } from '@/global/context/reducers/filesReducer';
import MessageInput from '@/Atoms/Input/MessageInput';
import FilePreview from './Overlays/FilePreview';
import SelectedFiles, { SelectedFileType } from './SelectedFiles';
import { validateFilesAndGetThumbnails } from '@/utils/validateFIlesAndGetThumbnail';
import { toast } from 'sonner';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { closeOverlay } from '@/global/features/overlaySlice';

interface IOverlayContainer {
  parentRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

const OverlayContainer: FC<IOverlayContainer> = ({ parentRef, isOpen, onClose }) => {
  const { state, dispatch } = useFilesContext();

  const [loadedFiles, setLoadedFiles] = useState<SelectedFileType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const RTK_Dispatch = useDispatch();

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.position = 'relative';
    }
  }, [parentRef]);

  useEffect(() => {
    const getFilesThumbnailAndValidateThem = async () => {
      try {
        setIsLoading(true);
        const loadedFiles = await validateFilesAndGetThumbnails({ files: state.files, thumbnailDimensions: { height: 60, width: 60 }, from: state.from });
        if (loadedFiles) {
          setLoadedFiles(loadedFiles);
        }
        const firstFile = loadedFiles[0];
        dispatch({
          type: FilesActionType.selectFileToPreview,
          payload: { id: firstFile.id, name: firstFile.file.name, size: firstFile.file.size, type: firstFile.type, url: firstFile.url },
        });


      } catch (error) {
        console.log("🚀 ~ getFilesThumbnailAndValidateThem ~ error:", error)
        toast.error('There is an Error while loading files...');
        RTK_Dispatch(closeOverlay());
      } finally {
        setIsLoading(false);
      }
    };
    if (state.files.length !== 0) {
      getFilesThumbnailAndValidateThem();
    }
  }, [state, dispatch, onClose, RTK_Dispatch]);

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
          {isLoading ? (
            <div className="flex h-full w-full place-items-center justify-center">
              <Image src={'/icons/spinner.svg'} height={100} width={100} alt="Loading Spinner" />
            </div>
          ) : (
            <>
              <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text relative flex h-11 flex-shrink-0 place-items-center justify-between px-4 py-2">
                <OptionIcon src="/icons/x.svg" onClick={handleOnClose} />
                <span className="flex flex-shrink-0 flex-grow justify-center">{state.fileToPreview.name ? state.fileToPreview.name : 'Selected File'}</span>
              </span>

              <div className="h-full w-full">
                <FilePreview {...state.fileToPreview} />
              </div>
              <div className="mx-auto my-2 w-[70%]">
                <MessageInput placeholder="Type message" />
              </div>
              <SelectedFiles files={loadedFiles} />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default OverlayContainer;
