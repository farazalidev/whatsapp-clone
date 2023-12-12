import React, { FC } from 'react';
import Avatar from '../Avatar';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import SideBarUserCardOptions from './SideBarUserCardOptions';

interface SideBarUserCardProps {
  avatar_src?: string | Blob | undefined;
  name: string;
  last_message?: string;
  last_message_date?: string;
  show_options?: boolean;
  onClick?: () => void;
}

const SideBarUserCard: FC<SideBarUserCardProps> = ({ avatar_src, name, last_message, last_message_date, show_options = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex px-2 dark:bg-whatsapp-dark-primary_bg dark:text-white',
        ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
      )}
    >
      <span className="py-4">
        <Avatar avatar_src={avatar_src} name={name} height={55} width={55} />
      </span>
      <div className="flex w-full place-items-center justify-between px-3  border-b-[1px] border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg">
        <div className="flex flex-col justify-evenly">
          <span className="text-sm md:text-base">{name}</span>
          <span className="font-extralight text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{last_message}</span>
        </div>
        {show_options ? (
          <span className="relative flex flex-col gap-3 h-[60%]">
            <motion.div className="font-extralight text-xs text-gray-600 dark:text-gray-400">{last_message_date}</motion.div>
            <span className="hidden group-hover:block absolute bottom-0 right-0">
              <SideBarUserCardOptions />
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SideBarUserCard;
