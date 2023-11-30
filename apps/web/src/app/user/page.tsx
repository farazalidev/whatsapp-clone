import UserSideBar from '@/components/User/Sidebar/UserSideBar';
import UserChat from '@/components/User/UserChat';
import React from 'react';

const UserPage = () => {
  return (
    <div className="flex h-full">
      <aside className="flex-none flex-shrink-0 w-[30%] h-full">
        <UserSideBar />
      </aside>
      <div className="flex-grow flex-1">
        <UserChat />
      </div>
    </div>
  );
};

export default UserPage;
