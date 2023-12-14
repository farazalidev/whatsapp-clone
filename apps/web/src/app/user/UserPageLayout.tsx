import OutInAnimation from '@/animation/OutInAnimation';
import AuthPageTop from '@/components/AuthPage/AuthPageTop';
import React, { FC, ReactNode } from 'react';

const UserPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-whatsapp-light-bg dark:bg-whatsapp-dark-bg relative flex h-screen w-full place-items-center justify-center">
      <AuthPageTop noLogo className="dark:bg-whatsapp-dark-bg absolute top-0" />
      <OutInAnimation className="absolute h-full   xl:container xl:h-[96%]">{children}</OutInAnimation>
    </div>
  );
};

export default UserPageLayout;
