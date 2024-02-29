'use client'
import OutInAnimation from '@/animation/OutInAnimation';
import AuthPageTop from '@/components/AuthPage/AuthPageTop';
import GalleryOverlay from '@/components/User/Gallery/GalleryOverlay';
import { toggleGalleryOverlay } from '@/global/features/overlaySlice';
import { RootState } from '@/global/store';
import React, { FC, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserPageLayout: FC<{ children: ReactNode }> = ({ children }) => {

  const { GalleryOverlayIsOpen } = useSelector((state: RootState) => state.overlaySlice)

  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(toggleGalleryOverlay())
  }

  return (
    <div className="bg-whatsapp-light-bg dark:bg-whatsapp-dark-bg relative flex h-screen w-full place-items-center justify-center overflow-hidden ">
      <GalleryOverlay show={GalleryOverlayIsOpen} onClose={handleClose} />
      <AuthPageTop noLogo className="dark:bg-whatsapp-dark-bg absolute top-0" />
      <OutInAnimation className="absolute h-full xl:container xl:h-[96%] max-h-[1500px]">{children}</OutInAnimation>
    </div>
  );
};

export default UserPageLayout;
