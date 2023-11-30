import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const EncryptionMessage = () => {
  return (
    <p className="w-full flex place-items-center justify-center p-1 my-1">
      <Image src={'/icons/lock.svg'} height={15} width={15} alt="lock" className="text-white pointer-events-none " />
      <span className="align-text-bottom text-xs font-extralight text-gray-700 dark:text-white cursor-pointer flex gap-1">
        <span className="pointer-events-none">Your personal messages are</span>
        <Link href={''} className="cursor-pointer">
          end-to-end encrypted
        </Link>
      </span>
    </p>
  );
};

export default EncryptionMessage;
