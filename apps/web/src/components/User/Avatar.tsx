import { fetcher } from '@/utils/fetcher';
import Image from 'next/image';
import React, { FC, Suspense } from 'react';
import useSwr from 'swr';

export interface AvatarProps {
  name?: string;
  height?: number;
  width?: number;
  avatar_path?: string;
  isAbsolute?: boolean;
}

const Avatar: FC<AvatarProps> = ({ avatar_path, isAbsolute, name, height = 55, width = 55 }) => {
  const fetchProfilePic = async () => {
    if (isAbsolute) {
      return avatar_path;
    }
    const blob = await fetcher(`user/profile-image/${avatar_path}`, undefined, 'blob');
    const url = URL.createObjectURL(blob);
    return url;
  };

  const { data } = useSwr(avatar_path, fetchProfilePic);

  return (
    <Suspense fallback={'loading'}>
      <div className="relative  h-[55px] w-[55px]">
        <Image
          src={(data as string) || '/icons/avatardefault.svg'}
          fill
          className="rounded-full h-[55px] w-[55px] object-cover"
          // objectPosition="center"
          alt={name ? name : 'user'}
        />
      </div>
    </Suspense>
  );
};

export default Avatar;
