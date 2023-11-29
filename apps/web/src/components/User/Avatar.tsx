import Image from 'next/image';
import React from 'react';

const Avatar = () => {
    return (
        <div>
            <Image src={'/Avatar.png'} height={45} width={45} className="rounded-full" alt="avatar" />
        </div>
    );
};

export default Avatar;
