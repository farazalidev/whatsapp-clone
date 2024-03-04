'use client'
import React, { FC, ReactNode } from 'react';

const UserPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="w-full h-screen">{children}</div>;
};

export default UserPageLayout;
