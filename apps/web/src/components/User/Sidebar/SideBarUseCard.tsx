'use client';
import React from 'react';
import Avatar from '../Avatar';
import SideBarUserCardOptions from './SideBarUserCardOptions';
import { motion } from 'framer-motion';

const SideBarUseCard = () => {
  return (
    <div className="group relative flex px-2 dark:bg-whatsapp-dark-primary_bg dark:text-white hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer">
      <span className="py-4">
        <Avatar />
      </span>
      <div className="flex w-full place-items-center justify-between px-3  border-b-[1px] border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg">
        <div className="flex flex-col justify-evenly">
          <span className="text-sm md:text-base">Name</span>
          <span className="font-extralight text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">Last message</span>
        </div>
        <span className="relative flex flex-col gap-3 h-[60%]">
          <motion.div className="font-extralight text-xs text-gray-600 dark:text-gray-400">Friday</motion.div>
          <span className="hidden group-hover:block absolute bottom-0 right-0">
            <SideBarUserCardOptions />
          </span>
        </span>
      </div>
    </div>
  );
};

export default SideBarUseCard;
