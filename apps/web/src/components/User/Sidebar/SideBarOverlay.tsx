'use client';
import React, { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SideBarOverlayHeader from './SideBarOverlayHeader';
import { useDispatch } from 'react-redux';
import { setShow } from '@/global/features/SideBarOverlaySlice';

interface SideBarOverlayProps {
  show: boolean;
  heading: string;
  Content: FC;
}

const SideBarOverlay: FC<SideBarOverlayProps> = ({ show, Content, heading }) => {
  const dispatch = useDispatch();

  const [shouldShown, setShouldShown] = useState(show);

  useEffect(() => {
    setShouldShown(show);
  }, [setShouldShown, show]);

  const handleBack = () => {
    dispatch(setShow(false));
    setShouldShown(false);
  };

  return shouldShown ? (
    <motion.div
      initial={{ left: '-100%' }}
      animate={{ left: 0, animation: 'ease-in-out' }}
      exit={{ left: '-100%' }}
      className="absolute w-full h-full bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg z-10 "
    >
      <SideBarOverlayHeader heading={heading} onBackClick={handleBack} />
      <Content />
    </motion.div>
  ) : null;
};

export default SideBarOverlay;
