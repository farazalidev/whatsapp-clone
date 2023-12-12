'use client';
import React, { FC } from 'react';
import Avatar from '../Avatar';
import SideBarHeaderOptions from './SideBarHeaderOptions';
import useUser from '@/hooks/useUser';

interface SideBarHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SideBarHeader: FC<SideBarHeaderProps> = ({ ...props }) => {
  const { data } = useUser();

  return (
    <div
      className="w-full inline-flex justify-between place-items-center px-4 py-2 bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg"
      {...props}
    >
      <Avatar avatar_src={data?.profile_pic} />
      <SideBarHeaderOptions />
    </div>
  );
};

export default SideBarHeader;
