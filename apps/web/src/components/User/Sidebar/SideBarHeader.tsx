'use client';
import React, { FC } from 'react';
import Avatar from '../Avatar';
import SideBarHeaderOptions from './SideBarHeaderOptions';
import { useSelector } from 'react-redux';
import { RootState } from '@/global/store';

interface SideBarHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SideBarHeader: FC<SideBarHeaderProps> = ({ ...props }) => {
  const data = useSelector((state: RootState) => state.UserSlice);

  return (
    <div
      className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg inline-flex w-full place-items-center justify-between px-4 py-2"
      {...props}
    >
      <Avatar for_other={false} user_id={data?.Me?.user_id} height={40} width={40} />
      <SideBarHeaderOptions />
    </div>
  );
};

export default SideBarHeader;
