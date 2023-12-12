import { isBlob } from '@/utils/isBlob';
import Image from 'next/image';
import React, { FC } from 'react';

interface AvatarProps {
  avatar_src?: string | Blob;
  name?: string;
  height?: number;
  width?: number;
}

const Avatar: FC<AvatarProps> = ({ avatar_src = '/icons/avatardefault.svg', name, height = 55, width = 50 }) => {
  console.log(avatar_src instanceof Blob);

  const src = isBlob(avatar_src) ? URL.createObjectURL(avatar_src as Blob) : avatar_src;

  return (
    <div className="relative border-2 border-red-300">
      <Image
        src={src as string}
        height={height}
        width={width}
        className="rounded-full"
        objectFit="cover"
        objectPosition="center"
        alt={name ? name : 'user'}
      />
    </div>
  );
};

export default Avatar;
