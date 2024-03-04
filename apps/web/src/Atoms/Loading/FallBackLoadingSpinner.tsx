import Image from 'next/image';
import React from 'react';

const FallBackLoadingSpinner = () => {
  return (
    <div className="w-full h-full flex place-items-center justify-center">

      <Image src={'/icons/spinner.svg'} width={55} height={55} alt="Loading" priority />
    </div>
  );
};

export default FallBackLoadingSpinner;
