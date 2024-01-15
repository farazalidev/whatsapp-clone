import React, { ChangeEvent, useState } from 'react';
import { Popover } from '@headlessui/react';
import OptionIcon from '../../Sidebar/OptionIcon';
import AttachmentOption from './AttachmentOption';
import AttachmentOptionFile from './AttachmentOptionFIle';
import { useFilesContext } from '@/global/context/filesContext';
import { toggleDocumentOverlay } from '@/global/features/overlaySlice';
import { useDispatch } from 'react-redux';
import { FilesActionType } from '@/global/context/reducers/filesReducer';

const Attachments = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { state, dispatch } = useFilesContext();

  const RTK_dispatch = useDispatch();

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).map((file) => {
        dispatch({ type: FilesActionType.Add_File, payload: { file, from: 'document' } });
      });
    }
    RTK_dispatch(toggleDocumentOverlay());
  };
  console.log(state);

  return (
    <Popover
      as="span"
      className={`hover:bg-whatsapp-misc-attachment_bg_hover } relative rounded-full p-1 ${isOpen ? 'bg-whatsapp-misc-attachment_bg_hover' : ''}`}
    >
      {({ open, close }) => {
        open ? setIsOpen(true) : setIsOpen(false);
        return (
          <>
            <Popover.Button as="span" className={`hover:bg-whatsapp-misc-attachment_bg_hover rounded-full`}>
              <OptionIcon
                src="/icons/attach-menu-plus.svg"
                tooltip="attach"
                className={`${open ? 'rotate-45 transform transition-transform ease-in-out' : ''}`}
              />
            </Popover.Button>
            <Popover.Panel
              className={`bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-secondary_bg absolute -top-[270px] z-10 h-fit w-52 rounded-2xl py-2 shadow-xl`}
            >
              <div className="flex flex-col">
                <AttachmentOptionFile
                  iconSrc="/icons/document.svg"
                  title="Document"
                  acceptedTypes={['audio/*', 'image/*', 'video/*', 'application/pdf']}
                  onChange={handleDocumentChange}
                  multiple
                />
                <AttachmentOptionFile iconSrc="/icons/pictures.svg" title="Photos & Videos" acceptedTypes={['image/*', 'video/*']} />
                <AttachmentOption iconSrc="/icons/camera.svg" title="Camera" />
                <AttachmentOption iconSrc="/icons/contact.svg" title="Contact" />
                <AttachmentOption iconSrc="/icons/poll.svg" title="Poll" />
                <AttachmentOptionFile iconSrc="/icons/sticker.svg" title="New Sticker" acceptedTypes={['image/*']} />
              </div>
            </Popover.Panel>
          </>
        );
      }}
    </Popover>
  );
};

export default Attachments;
