import Typography from '@/Atoms/Typography/Typography';
import Image from 'next/image';
import React, { FC } from 'react';

interface SideBarOverlayHeaderProps {
  heading: string;
  onBackClick: () => void;
}

const SideBarOverlayHeader: FC<SideBarOverlayHeaderProps> = ({ heading, onBackClick }) => {
  return (
    <div className="w-full relative h-[120px] bg-whatsapp-misc-sideBarOverlayHeaderLightBg dark:bg-whatsapp-dark-secondary_bg">
      <div className="absolute flex gap-6 place-items-center bottom-4 left-4">
        <span className="relative cursor-pointer text-white" onClick={onBackClick}>
          <Image src={'/icons/back.svg'} width={25} height={25} alt="back" />
        </span>
        <Typography level={4} className="pointer-events-none text-white">
          {heading}
        </Typography>
      </div>
    </div>
  );
};

export default SideBarOverlayHeader;
