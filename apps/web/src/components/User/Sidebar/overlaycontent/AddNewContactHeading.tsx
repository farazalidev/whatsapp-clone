import React, { FC } from 'react';

interface AddNewContactHeadingProps {
  heading: string;
}

const AddNewContactHeading: FC<AddNewContactHeadingProps> = ({ heading }) => {
  return (
    <div className="group relative flex px-2 dark:bg-whatsapp-dark-primary_bg dark:text-white pointer-events-none">
      <div className="flex w-full place-items-center justify-between pl-12">
        <div className="py-4 flex flex-col justify-evenly   border-b-[1px] border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg w-full">
          <span className="text-sm md:text-base uppercase text-whatsapp-default-primary_green font-extralight">{heading}</span>
        </div>
      </div>
    </div>
  );
};

export default AddNewContactHeading;
