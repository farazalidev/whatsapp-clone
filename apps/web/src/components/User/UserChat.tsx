import Typography from '@/Atoms/Typography/Typography';
import Image from 'next/image';
import React from 'react';

const UserChat = () => {
  return (
    <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg w-full h-full flex flex-col justify-center place-items-center gap-7">
      <span>
        <Image src={'/icons/web.svg'} width={350} height={350} alt="whatsapp web" />
      </span>
      <span className="text-center flex flex-col gap-2">
        <Typography className="text-3xl">Whatsapp Web</Typography>
        <div>
          <Typography level={1} className="font-extralight text-whatsapp-dark-secondary_bg opacity-70">
            Send and Receive messages without keeping your phone online.
          </Typography>
          <Typography level={1} className="font-extralight text-whatsapp-dark-secondary_bg opacity-70">
            Use Whatsapp on upto 4 linked devices and 1 phone at the same time.{' '}
          </Typography>
        </div>
      </span>
    </div>
  );
};

export default UserChat;
