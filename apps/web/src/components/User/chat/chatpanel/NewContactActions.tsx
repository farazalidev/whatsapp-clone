import { cn } from '@/utils/cn';
import React from 'react';
import { IconType } from 'react-icons';
import { GrDislike } from 'react-icons/gr';
import { MdOutlineBlock } from 'react-icons/md';
import { IoMdPersonAdd } from 'react-icons/io';

const AddNewContactActionIcon = ({
  title,
  Icon,
  tooltip,
  isDanger,
}: {
  title: string;
  Icon: IconType;
  tooltip: string;
  isDanger?: boolean;
}) => {
  return (
    <span
      className={cn(
        `${isDanger ? 'text-red-600' : 'text-whatsapp-default-primary_green'}  flex h-full cursor-pointer place-items-center  gap-1 px-2 `,
        'hover:bg-gray-700',
      )}
      title={tooltip}
    >
      <Icon size={22} />
      {title}
    </span>
  );
};

const NewContactActions = () => {
  return (
    <div
      className={cn(
        'bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg dark:text-whatsapp-dark-text text-whatsapp-light-text',
        ' sticky left-0 right-0 top-0 m-0 h-[60px]',
      )}
    >
      <div className="flex h-full w-full place-items-center justify-center gap-5">
        <AddNewContactActionIcon Icon={GrDislike} title="Report" tooltip="report" isDanger />
        <AddNewContactActionIcon Icon={MdOutlineBlock} title="Block" tooltip="block contact" isDanger />
        <AddNewContactActionIcon Icon={IoMdPersonAdd} title="Add to Contacts" tooltip="add to contacts" />
      </div>
    </div>
  );
};

export default NewContactActions;
