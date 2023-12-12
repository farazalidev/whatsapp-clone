import Image from 'next/image';
import React from 'react';

const FallBackLoadingSpinner = () => {
  return (
    <div className="w-full h-full flex place-items-center justify-center">
      <Image src={'/gifs/loading.gif'} width={55} height={55} alt="Loading" />
    </div>
  );
};

export default FallBackLoadingSpinner;
