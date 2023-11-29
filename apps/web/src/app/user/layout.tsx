import OutInAnimation from '@/animation/OutInAnimation';
import AuthPageTop from '@/components/AuthPage/AuthPageTop';
import React, { FC, ReactNode } from 'react';

const UserPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="relative w-full h-screen bg-whatsapp-light-bg dark:bg-whatsapp-dark-bg flex place-items-center justify-center">
            <AuthPageTop noLogo className="dark:bg-whatsapp-dark-bg absolute top-0" />
            <OutInAnimation className="absolute container h-[90%] bg-white">{children}</OutInAnimation>
        </div>
    );
};

export default UserPageLayout;
