import React, { FC } from 'react';
import { cn } from '@/utils/cn';
import Avatar from '@/components/User/Avatar';

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
        ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
      )}
    >
      <span className="py-4">
        <Avatar isAbsolute absolute_src={icon_path} name={title} height={55} width={55} />
      </span>
      <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full place-items-center  justify-between border-b-[1px] px-3">
        <div className="flex flex-col justify-evenly">
          <span className="text-sm md:text-base">{title}</span>
        </div>{' '}
      </div>
    </div>
  );
};

export default SideBarOptionCard;
