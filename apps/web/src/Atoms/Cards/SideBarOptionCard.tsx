import React, { FC } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface SideBarOptionCardProps {
  icon_path: string;
  title: string;
  onClick?: () => void;
}

const SideBarOptionCard: FC<SideBarOptionCardProps> = ({ icon_path, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'dark:bg-whatsapp-dark-primary_bg group relative flex px-2 dark:text-white',
        ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer py-3 border-b-[1px] border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg',
      )}
    >
      <div className="bg-whatsapp-misc-sideBarOverlayHeaderLightBg rounded-full h-[55px] w-[65px] flex justify-center place-items-center">
        <Image src={icon_path} height={40} width={40} alt='add contact' />
      </div>
      <div className=" flex w-full place-items-center justify-between  px-3">
        <div className="flex flex-col justify-evenly">
          <span className="text-sm md:text-base">{title}</span>
        </div>{' '}
      </div>
    </div>
  );
};

export default SideBarOptionCard;
