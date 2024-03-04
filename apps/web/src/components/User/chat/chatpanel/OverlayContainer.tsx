import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { slideUpAnimation } from '@/animation/slide-up-Animation';
import MessageInput from '@/Atoms/Input/MessageInput';
import FilePreview from './Overlays/FilePreview';
import SelectedFiles from './SelectedFiles';
import { validateFilesAndGetThumbnails } from '@/utils/validateFIlesAndGetThumbnail';
import { toast } from 'sonner';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { closeOverlay } from '@/global/features/overlaySlice';
import { RootState } from '@/global/store';
import { addAttachedMessage, addFileToPreview, addLoadedFiles, resetFiles } from '@/global/features/filesSlice';

interface IOverlayContainer {
  parentRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

const OverlayContainer: FC<IOverlayContainer> = ({ parentRef, isOpen, onClose }) => {
  const { files, from, fileToPreview, loadedFiles } = useSelector((state: RootState) => state.filesSlice)

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.position = 'relative';
    }
  }, [parentRef]);

  useEffect(() => {
    const getFilesThumbnailAndValidateThem = async () => {
      try {
        setIsLoading(true);
        const loadedFiles = await validateFilesAndGetThumbnails({ files: files, thumbnailDimensions: { height: 264, width: 264 }, from: from });
        if (loadedFiles) {
          dispatch(addLoadedFiles({ loadedFiles }))
        }
        const firstFile = loadedFiles[0];
        dispatch(addFileToPreview({ id: firstFile.id, name: firstFile.file.name, size: firstFile.file.size, type: firstFile.type, url: firstFile.url, attachedMessage: null }))


      } catch (error) {
        toast.error('There is an Error while loading files...');
        dispatch(closeOverlay());
      } finally {
        setIsLoading(false);
      }
    };

    if (files.length !== 0) {

      getFilesThumbnailAndValidateThem();
    }
  }, [files, from, dispatch]);

  const handleOnClose = () => {
    onClose();
    dispatch(resetFiles())
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(addAttachedMessage(e.target.value))
  }


  const getLoadedFileAttachedMessage = (id: string | null) => {

    const attachedMessage = loadedFiles.find(file => file.id === id)
    return attachedMessage?.attachedMessage
  }

  return (
    <AnimatePresence key={'overlay-container'}>
      {isOpen ? (
        <motion.div
          {...slideUpAnimation}
          className={`bg-whatsapp-light-secondary_gray dark:bg-whatsapp-dark-primary_bg absolute z-30 flex h-full w-full flex-col overflow-hidden px-2 `}
        >
          {isLoading ? (
            <div className="flex h-full w-full place-items-center justify-center z-30">
              <Image src={'/icons/spinner.svg'} height={100} width={100} alt="Loading Spinner" />
            </div>
          ) : (
            <>
              <span className="text-whatsapp-light-text dark:text-whatsapp-dark-text relative flex h-11 flex-shrink-0 place-items-center justify-between px-4 py-2">
                <OptionIcon src="/icons/x.svg" onClick={handleOnClose} />
                <span className="flex flex-shrink-0 flex-grow justify-center">{fileToPreview.name ? fileToPreview.name : 'Selected File'}</span>
              </span>

              <div className="h-full w-full">
                <FilePreview {...fileToPreview} />
              </div>
              <div className="mx-auto my-2 w-[70%]">
                <MessageInput placeholder="Type message" key={fileToPreview.id} value={getLoadedFileAttachedMessage(fileToPreview.id) || ""} onChange={handleMessageChange} />
              </div>
              <SelectedFiles />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default React.memo(OverlayContainer);
