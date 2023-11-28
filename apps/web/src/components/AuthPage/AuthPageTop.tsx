import Image from 'next/image';
import React from 'react';

const AuthPageTop = () => {
  return (
    <div className='bg-whatsapp-default-primary_green w-full h-[200px] py-4'>
      <div className='p-4 container flex place-items-center  gap-2'>
        <Image src={'/logo.svg'} alt={'whatsapp'} style={{ objectFit: 'cover' }} width={40} height={40} />
        <span className='uppercase text-white text-sm'>Whatsapp web</span>
      </div>
    </div>
  );
};

export default AuthPageTop;
