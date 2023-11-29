import { cn } from '@/utils/cn';
import Image from 'next/image';
import React, { FC } from 'react';

interface OptionIconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    src: string;
    tooltip: string;
}

const OptionIcon: FC<OptionIconProps> = ({ src, tooltip, className, ...props }) => {
    return (
        <span {...props} title={tooltip}>
            <Image src={src} alt="" height={25} width={25} title={tooltip} className={cn('cursor-pointer', className)} />
        </span>
    );
};

export default OptionIcon;
