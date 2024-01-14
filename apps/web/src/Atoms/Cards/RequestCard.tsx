import Avatar, { AvatarProps } from '@/components/User/Avatar';
import { cn } from '@/utils/cn';
import React, { FC } from 'react';
import Button from '../Button/Button';

interface IRequestCard extends AvatarProps {
  onButtonClick?: () => void;
  name: string;
}

const RequestCard: FC<IRequestCard> = ({ name, onButtonClick, ...props }) => {
  return (
    <div
      className={cn(
        'dark:bg-whatsapp-dark-primary_bg group relative flex px-2 dark:text-white',
        ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
      )}
    >
      <span className="py-4">
        <Avatar {...props} name={name} height={55} width={55} />
      </span>
      <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full place-items-center  justify-between border-b-[1px] px-3">
        <div className="flex flex-col justify-evenly">
          <span className="text-sm md:text-base">{name}</span>
        </div>
        <div>
          <Button size={'md'} className="whitespace-nowrap" onClick={onButtonClick}>
            Add Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
