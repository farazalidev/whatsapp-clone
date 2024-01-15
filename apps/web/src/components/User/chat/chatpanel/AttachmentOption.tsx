import Image from 'next/image';
import React, { FC } from 'react';

interface IAttachmentOption {
  iconSrc: string;
  title: string;
  onClick?: () => void;
}

const AttachmentOption: FC<IAttachmentOption> = ({ iconSrc, title, onClick }) => {
  return (
    <div
      className="text-whatsapp-light-text dark:text-whatsapp-dark-text hover:bg-whatsapp-light-secondary_bg hover:dark:bg-whatsapp-dark-primary_bg mx-auto flex h-[40px] w-[90%] place-items-center gap-2 rounded-xl px-2 hover:cursor-pointer"
      onClick={onClick}
    >
      <Image src={iconSrc} width={20} height={20} alt="attachment " />
      <span>{title}</span>
    </div>
  );
};

export default AttachmentOption;
