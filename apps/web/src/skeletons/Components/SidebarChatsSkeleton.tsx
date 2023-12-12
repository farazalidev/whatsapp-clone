import React from 'react';
import UserCardSkeleton from '../Atoms/UserCardSkeleton';

const SidebarChatsSkeleton = () => {
  return (
    <div>
      {Array(10).map((_, index) => {
        return <UserCardSkeleton key={index} />;
      })}
    </div>
  );
};

export default SidebarChatsSkeleton;
