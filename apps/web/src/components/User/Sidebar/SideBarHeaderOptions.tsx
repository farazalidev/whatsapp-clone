'use client';
import React from 'react';
import OptionIcon from './OptionIcon';
import { useDispatch } from 'react-redux';
import { setSelectedOverlay, setShow } from '@/global/features/SideBarOverlaySlice';

interface SideBarHeaderOptionsIconsType {
  src: string;
  tooltip: string;
}

const SideBarHeaderOptionsIcons: SideBarHeaderOptionsIconsType[] = [
  { src: '/icons/comminities.svg', tooltip: 'Communities' },
  { src: '/icons/status.svg', tooltip: 'Status' },
  { src: '/icons/channels.svg', tooltip: 'Channels' },
  { src: '/icons/newchat.svg', tooltip: 'New Chat' },
];

const SideBarHeaderOptions = () => {
  const dispatch = useDispatch();

  const handleIconClick = (index: number) => {
    dispatch(setSelectedOverlay(index));
    dispatch(setShow(true));
  };
  return (
    <div className="flex place-items-center gap-4">
      {SideBarHeaderOptionsIcons.map((icon, index) => (
        <OptionIcon key={index} src={icon.src} tooltip={icon.tooltip} onClick={() => handleIconClick(index)} />
      ))}
      <OptionIcon src="/icons/option.svg" tooltip="Menu" />
    </div>
  );
};

export default SideBarHeaderOptions;
