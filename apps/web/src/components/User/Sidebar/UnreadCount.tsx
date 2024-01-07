import { cn } from '@/utils/cn';
import React from 'react';

const UnreadCount = ({ count }: { count: number | undefined }) => {
  return count ? (
    <span
      className={cn([
        'bg-whatsapp-default-primary_green dark:text-whatsapp-light-text text-whatsapp-dark-text',
        'flex h-6 w-6 shrink-0 grow-0 place-items-center justify-center rounded-full p-[6px] text-sm ',
      ])}
    >
      {count > 10 ? '10+' : count}
    </span>
  ) : null;
};

export default UnreadCount;
