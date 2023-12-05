import Image from 'next/image';
import React from 'react';
import LoadingBar from './LoadingBar';

const MainLoading = () => {
  return (
    <div className="w-full h-full flex flex-col border-2 border-red-800 place-items-center justify-center">
      <div className="relative border-2 border-white">
        <Image src={'/icons/loading.svg'} fill alt="Loading" className="absolute" />
        <LoadingBar />
      </div>
    </div>
  );
};

export default MainLoading;
