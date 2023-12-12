'use client';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import Image from 'next/image';
import React, { FC } from 'react';

interface IMainLoading {}

const MainLoadingPage: FC<IMainLoading> = () => {
  return (
    <>
      <div className="w-full h-full flex flex-col place-items-center justify-center bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg">
        <div className="relative flex flex-col place-items-center justify-center gap-4">
          <div className="flex place-items-center justify-center w-full">
            <Image src={'/icons/loading-cropped.svg'} width={300} height={300} alt="Loading" priority />
          </div>
          <div className="w-20 h-20">
            <FallBackLoadingSpinner />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLoadingPage;
