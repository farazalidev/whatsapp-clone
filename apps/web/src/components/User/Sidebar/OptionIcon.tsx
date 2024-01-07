import { cn } from '@/utils/cn';
import Image from 'next/image';
import React, { FC } from 'react';

interface OptionIconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  src: string;
  tooltip?: string;
  height?: number;
  width?: number;
}

const OptionIcon: FC<OptionIconProps> = ({ src, tooltip, className, height = 25, width = 25, ...props }) => {
  return (
    <span {...props} title={tooltip}>
      <Image src={src} alt="" height={height} width={width} title={tooltip} className={cn('cursor-pointer dark:fill-white', className)} />
    </span>
  );
};

export default OptionIcon;
