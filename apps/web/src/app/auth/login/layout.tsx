import React, { FC } from 'react';

interface LoginPageLayoutProps {
  children: React.ReactNode;
}

const LoginPageLayout: FC<LoginPageLayoutProps> = ({ children }) => {
  return <div className='h-screen w-full'>{children}</div>;
};

export default LoginPageLayout;
