import { cn } from '@/utils/cn';
import { fetcher } from '@/utils/fetcher';
import Image from 'next/image';
import React, { FC } from 'react';
import useSwr from 'swr';

export interface AvatarProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name?: string;
  height?: number;
  width?: number;
  user_id?: string;
  isAbsolute?: boolean;
  absolute_src?: string;
  for_other?: boolean;
}

const Avatar: FC<AvatarProps> = ({ user_id, for_other, isAbsolute, absolute_src, name, height = 55, width = 55, ...props }) => {
  const getProfilePic = async () => {
    const blob = await fetcher(`api/file/get-profile-pic/${user_id}/small`, undefined, "blob", "static")
    const url = URL.createObjectURL(blob)
    return url
  }

  // const { data } = useSwr(for_other ? user_id : 'profile-pic', isAbsolute ? null : for_other ? fetchOtherProfilePic : fetchProfilePic);
  const { data } = useSwr(user_id, isAbsolute ? null : getProfilePic);

  return (
      <div {...props} className={cn('relative', props.className)} style={{ height, width }}>
        {isAbsolute ? (
          <Image src={absolute_src || '/icons/avatardefault.svg'} fill className="h-[55px] w-[55px] rounded-full object-cover" alt={name ? name : 'user'} />
        ) : (
          <Image src={(data as string) || '/icons/avatardefault.svg'} fill className="h-[55px] w-[55px] rounded-full object-cover" alt={name ? name : 'user'} />
        )}
    </div>
  );
};

export default Avatar;
