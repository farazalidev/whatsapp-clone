'use client';
import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SideBarOverlayHeader from './SideBarOverlayHeader';
import { useDispatch } from 'react-redux';
import { setShow } from '@/global/features/SideBarOverlaySlice';
import { easeInOutAnimation } from '@/animation/ease-in-out-Animation';

interface SideBarOverlayProps {
  show: boolean;
  heading: string;
  Content: FC;
}

const SideBarOverlay: FC<SideBarOverlayProps> = ({ show, Content, heading }) => {
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(setShow(false));
  };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          {...easeInOutAnimation}
          className="absolute w-full h-full bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg z-10 overflow-y-auto scrollbar"
        >
          <SideBarOverlayHeader heading={heading} onBackClick={handleBack} />
          <Content />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SideBarOverlay;
