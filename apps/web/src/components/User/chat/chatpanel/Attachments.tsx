import React, { ChangeEvent, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import OptionIcon from '../../Sidebar/OptionIcon';
import AttachmentOption from './AttachmentOption';
import AttachmentOptionFile from './AttachmentOptionFIle';
import { toggleDocumentOverlay } from '@/global/features/overlaySlice';
import { useDispatch } from 'react-redux';
import { addFiles, filesFromType } from '@/global/features/filesSlice';

const Attachments = () => {
  const [isOpen, setIsOpen] = useState(false);


  const RTK_dispatch = useDispatch();

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>, from: filesFromType) => {
    const files = e.target.files;
    RTK_dispatch(addFiles({ files, from }))
    RTK_dispatch(toggleDocumentOverlay());
  };

  return (
    <Popover
      as="span"
      className={`hover:dark:bg-whatsapp-misc-attachment_bg_hover hover:bg-whatsapp-misc-attachment_bg_hover_light relative rounded-full p-1 ${isOpen ? 'dark:bg-whatsapp-misc-attachment_bg_hover bg-whatsapp-misc-attachment_bg_hover_light' : ''}`}
    >
      {({ open, close }) => {
        open ? setIsOpen(true) : setIsOpen(false);
        return (
          <>
            <Popover.Button as="span" className={`hover:dark:bg-whatsapp-misc-attachment_bg_hover rounded-full hover:bg-whatsapp-misc-attachment_bg_hover_light`}>
              <OptionIcon
                src="/icons/attach-menu-plus.svg"
                tooltip="attach"
                className={`${open ? 'rotate-45 transform transition-transform ease-in-out' : ''}`}
              />
            </Popover.Button>
            <Transition
              enter="transition duration-200 ease-in-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                className={`bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-secondary_bg absolute -top-[270px] z-10 h-fit w-52 rounded-2xl py-2 shadow-xl`}
              >
                <div className="flex flex-col">
                  <AttachmentOptionFile fromType='document' iconSrc="/icons/pictures.svg" title="Photos & Videos" multiple acceptedTypes={['image/*', 'video/*']} onChange={(e) => handleFilesChange(e, "videos&photos")} />
                  <AttachmentOptionFile
                    fromType='videos&photos'
                    iconSrc="/icons/document.svg"
                    title="Document"
                    acceptedTypes={['audio/*', 'image/*', 'video/*', 'application/pdf']}
                    onChange={(e) => handleFilesChange(e, "document")}
                    multiple
                  />
                  <AttachmentOption iconSrc="/icons/camera.svg" title="Camera" />
                  <AttachmentOption iconSrc="/icons/contact.svg" title="Contact" />
                  <AttachmentOption iconSrc="/icons/poll.svg" title="Poll" />
                  <AttachmentOptionFile fromType='sticker' iconSrc="/icons/sticker.svg" title="New Sticker" acceptedTypes={['image/*']} onChange={(e) => handleFilesChange(e, "sticker")} />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
};

export default Attachments;
