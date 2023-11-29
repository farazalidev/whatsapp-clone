import UserChat from '@/components/User/UserChat';
import UserSideBar from '@/components/User/UserSideBar';
import React from 'react';

const UserPage = () => {
    return (
        <div className="flex h-full">
            <aside className="flex-none flex-shrink-0 w-[30%] h-full  border-2 border-green-700">
                <UserSideBar />
            </aside>
            <div className="flex-grow border-2 border-red-700 flex-1">
                <UserChat />
            </div>
        </div>
    );
};

export default UserPage;
