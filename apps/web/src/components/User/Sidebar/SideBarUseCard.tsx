import React, { FC } from 'react';
import Avatar, { AvatarProps } from '../Avatar';
import { cn } from '@/utils/cn';
import SideBarUserCardOptions from './SideBarUserCardOptions';

interface SideBarUserCardProps extends AvatarProps {
  name: string;
  last_message?: string;
  last_message_date?: string;
  show_options?: boolean;
  onClick?: () => void;
}

const SideBarUserCard: FC<SideBarUserCardProps> = ({
  avatar_path,
  name,
  last_message,
  last_message_date,
  show_options = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'dark:bg-whatsapp-dark-primary_bg group relative flex w-full px-2 dark:text-white',
        ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
      )}
    >
      <span className="py-4">
        <Avatar avatar_path={avatar_path} name={name} height={55} width={55} />
      </span>
      <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full place-items-center  justify-between border-b-[1px] px-3">
        <div className="flex flex-col justify-evenly">
          <span className="w-[50%] overflow-ellipsis whitespace-nowrap text-sm md:text-base">{`${
            name && name?.length < 25 ? name : name?.slice(0, 25) + '...'
          }`}</span>
          <span className=" w-full text-ellipsis text-xs font-extralight text-gray-600 dark:text-gray-400 md:text-sm">
            {last_message ? `${last_message?.length < 25 ? last_message : last_message?.slice(0, 25) + '...'}` : null}
          </span>
        </div>
        {show_options ? (
          <span className="relative flex h-[60%] flex-col gap-3">
            <div className="text-xs font-extralight text-gray-600 dark:text-gray-400">{last_message_date}</div>
            <span className="absolute bottom-0 right-0 hidden group-hover:block">
              <SideBarUserCardOptions />
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SideBarUserCard;
