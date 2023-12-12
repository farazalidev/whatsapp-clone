import { isBlob } from '@/utils/isBlob';
import Image from 'next/image';
import React, { FC } from 'react';

interface AvatarProps {
  avatar_src?: string | Blob;
  name?: string;
  height?: number;
  width?: number;
}

const Avatar: FC<AvatarProps> = ({ avatar_src = '/icons/avatardefault.svg', name, height = 55, width = 55 }) => {
  console.log(avatar_src instanceof Blob);

  const src = isBlob(avatar_src) ? URL.createObjectURL(avatar_src as Blob) : avatar_src;

  return (
    <div className="relative  h-[55px] w-[55px]">
      <Image
        src={src as string}
        fill
        className="rounded-full h-[55px] w-[55px] object-cover"
        // objectPosition="center"
        alt={name ? name : 'user'}
      />
    </div>
  );
};

export default Avatar;
