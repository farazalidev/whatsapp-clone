import React, { FC } from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

interface props extends IContentLoaderProps {}

const UserCardSkeleton: FC<props> = (props) => {
  return (
    <div>
      <ContentLoader viewBox="0 0 400 160" height={160} width={400} {...props}>
        <rect x="110" y="21" rx="4" ry="4" width="254" height="6" />
        <rect x="111" y="41" rx="3" ry="3" width="185" height="7" />
        <rect x="304" y="-46" rx="3" ry="3" width="350" height="6" />
        <rect x="371" y="-45" rx="3" ry="3" width="380" height="6" />
        <rect x="484" y="-45" rx="3" ry="3" width="201" height="6" />
        <circle cx="48" cy="48" r="48" />
      </ContentLoader>
    </div>
  );
};

export default UserCardSkeleton;
