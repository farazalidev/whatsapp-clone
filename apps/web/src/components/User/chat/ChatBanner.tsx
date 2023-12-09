import Typography from '@/Atoms/Typography/Typography';
import Image from 'next/image';
import React from 'react';

const ChatBanner = () => {
  return (
    <>
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
    </>
  );
};

export default ChatBanner;
