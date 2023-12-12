/* eslint-disable react/no-unescaped-entities */
'use client';
import Typography from '@/Atoms/Typography/Typography';
import Image from 'next/image';
import React, { FC } from 'react';

interface IMainLoading {
  isError: boolean;
}

const MainErrorPage: FC<IMainLoading> = ({ isError }) => {
  return isError ? (
    <>
      <div className="w-full h-full flex flex-col place-items-center justify-center bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg">
        <div className="relative flex flex-col place-items-center justify-center gap-4">
          <div className="flex place-items-center justify-center w-full">
            <Image src={'/icons/Error_svg.svg'} width={300} height={300} alt="Error" priority />
          </div>
          <div className="w-[50%] h-full text-center">
            <Typography level={5}>Error 500</Typography>
            <Typography text_style={'error'}>
              Our servers are on strike, demanding better working conditions. We've tried negotiating with cookies, but they're holding out
              for brownies. We appreciate your patience as we bake a resolution.
            </Typography>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default MainErrorPage;
