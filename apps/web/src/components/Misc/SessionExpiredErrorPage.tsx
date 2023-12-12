import Button from '@/Atoms/Button/Button';
import Typography from '@/Atoms/Typography/Typography';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SessionExpiredErrorPage = () => {
  return (
    <div className="w-full h-full flex flex-col place-items-center justify-center bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg">
      <div className="relative flex flex-col place-items-center justify-center gap-4">
        <div className="flex place-items-center justify-center w-full">
          <Image src={'/icons/session-expired.svg'} width={300} height={300} alt="Error" priority />
        </div>
        <div className="w-[90%] md:w-[30%] line h-full text-center">
          <Typography level={5}>Error 401</Typography>
          <Typography text_style={'error'} className="text-justify">
            Oops! It seems like your session has expired. For security reasons, we automatically log users out after a period of inactivity.
            Please log in again to continue enjoying our services. Thank you for your understanding!
          </Typography>
          <Link href={'/auth/login'}>
            <Button size={'lg'} className="mt-4">
              Login Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredErrorPage;
