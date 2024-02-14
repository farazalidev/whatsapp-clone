import { AcceptedFileTypes } from '@/components/@types/component.types';
import { filesFromType } from '@/global/features/filesSlice';
import Image from 'next/image';
import React, { FC } from 'react';

interface IAttachmentOptionFile extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  iconSrc: string;
  title: string;
  acceptedTypes?: AcceptedFileTypes[];
  fromType: filesFromType
}

const AttachmentOptionFile: FC<IAttachmentOptionFile> = ({ iconSrc, title, acceptedTypes, fromType, ...props }) => {
  return (
    <>
      <input className="hidden" id={fromType} type="file" accept={acceptedTypes?.join(',')} {...props} />
      <label htmlFor={fromType} className="h-full w-full">
        <div className="text-whatsapp-light-text dark:text-whatsapp-dark-text hover:bg-whatsapp-light-secondary_bg hover:dark:bg-whatsapp-dark-primary_bg mx-auto flex h-[40px] w-[90%] place-items-center gap-2 rounded-xl px-2 hover:cursor-pointer">
          <Image src={iconSrc} width={20} height={20} alt="attachment " />
          <span>{title}</span>
        </div>
      </label>
    </>
  );
};

export default AttachmentOptionFile;
