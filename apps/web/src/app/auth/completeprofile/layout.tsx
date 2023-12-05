import React, { FC } from 'react';

interface CompleteProfilePageLayoutProps {
  children: React.ReactNode;
}

const CompleteProfilePageLayout: FC<CompleteProfilePageLayoutProps> = ({ children }) => {
  return <div className="h-screen w-full">{children}</div>;
};

export default CompleteProfilePageLayout;
