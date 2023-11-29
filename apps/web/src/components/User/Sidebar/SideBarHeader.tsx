import React, { FC } from 'react';
import Avatar from '../Avatar';
import SideBarHeaderOptions from './SideBarHeaderOptions';

interface SideBarHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const SideBarHeader: FC<SideBarHeaderProps> = ({ ...props }) => {
    return (
        <div
            className="w-full inline-flex justify-between place-items-center px-4 py-2 bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg"
            {...props}
        >
            <Avatar />
            <SideBarHeaderOptions />
        </div>
    );
};

export default SideBarHeader;
