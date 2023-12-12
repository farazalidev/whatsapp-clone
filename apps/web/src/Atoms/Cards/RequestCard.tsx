import Avatar from '@/components/User/Avatar';
import { cn } from '@/utils/cn';
import React, { FC } from 'react';
import Button from '../Button/Button';

interface IRequestCard {
  onClick?: () => void;
  avatar_src: string | Blob;
  name: string;
}

const RequestCard: FC<IRequestCard> = ({ avatar_src, name, onClick }) => {
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
        </div>
        <div>
          <Button size={'md'} className="whitespace-nowrap">
            Add Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
