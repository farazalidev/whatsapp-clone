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
      className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg inline-flex w-full place-items-center justify-between px-4 py-2"
      {...props}
    >
      <Avatar avatar_path={data?.Me.profile.pic_path} height={40} width={40} />
      <SideBarHeaderOptions />
    </div>
  );
};

export default SideBarHeader;
