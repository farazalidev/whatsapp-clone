import React, { FC } from 'react';
import Avatar, { AvatarProps } from '../Avatar';
import { cn } from '@/utils/cn';
import SideBarUserCardOptions from './SideBarUserCardOptions';
import UnreadCount from './UnreadCount';
import { clampString } from '@/utils/clamp';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { getDayOrFormattedDate } from '@/utils/getDateOrFormat';

interface SideBarUserCardProps extends AvatarProps {
  name: string;
  last_message?: MessageEntity;
  show_options?: boolean;
  active?: boolean;
  onClick?: () => void;
  unread_message_count?: number;
}

const SideBarUserCard: FC<SideBarUserCardProps> = ({
  name,
  last_message,
  show_options = true,
  active = false,
  onClick,
  unread_message_count,
  user_id,
  for_other,
}) => {
  console.log("🚀 ~ last_message:", last_message)
  return (
    <div
      onClick={onClick}
      className={cn(
        'dark:bg-whatsapp-dark-primary_bg group relative flex w-full px-2 dark:text-white',
        active
          ? 'bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg cursor-pointer'
          : ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
      )}
    >
      <span className="py-4">
        <Avatar user_id={user_id} for_other={for_other} name={name} height={55} width={55} />
      </span>
      <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full place-items-center  justify-between border-b-[1px] px-3">
        <div className="flex flex-col justify-evenly">
          <span className="w-[50%] overflow-ellipsis whitespace-nowrap text-sm md:text-base">{clampString(name, 25)}</span>
          <span className=" w-full text-ellipsis text-xs font-extralight text-gray-600 dark:text-gray-400 md:text-sm">
            {last_message ? clampString(last_message?.content, 25) : null}
          </span>
        </div>
        {show_options ? (
          <span className="relative flex h-[60%] flex-col gap-3">
            <div className="text-xs font-extralight text-gray-600 dark:text-gray-400">{last_message?.sended_at ? getDayOrFormattedDate(last_message?.sended_at) : null}</div>
            <div className="relative flex h-full place-items-center justify-evenly overflow-hidden">
              <span className="absolute left-[50%] transition-all duration-300 group-hover:left-0">
                {unread_message_count ? <UnreadCount count={unread_message_count} /> : null}
              </span>
              <span className="absolute -right-full transition-all duration-300 group-hover:right-0">
                <SideBarUserCardOptions />
              </span>
            </div>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SideBarUserCard;
