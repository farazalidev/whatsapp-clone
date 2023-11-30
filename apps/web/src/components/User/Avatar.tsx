import Image from 'next/image';
import React, { FC } from 'react';

interface AvatarProps {
  avatar_src?: string;
  name?: string;
}

const Avatar: FC<AvatarProps> = ({ avatar_src = '/icons/avatardefault.svg', name }) => {
  return (
    <div>
      <Image src={avatar_src} height={45} width={45} className="rounded-full" alt={name ? name : 'user'} />
    </div>
  );
};

export default Avatar;
