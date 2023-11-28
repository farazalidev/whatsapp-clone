import React, { FC } from 'react';

interface RegisterPageLayoutProps {
  children: React.ReactNode;
}

const RegisterLayout: FC<RegisterPageLayoutProps> = ({ children }) => {
  return <div className='h-screen w-full'>{children}</div>;
};

export default RegisterLayout;
