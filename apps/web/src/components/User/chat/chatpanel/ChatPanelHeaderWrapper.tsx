import { cn } from '@/utils/cn';
import React from 'react';

interface IChatPanelHeaderWrapper extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: React.ReactNode;
}

const ChatPanelHeaderWrapper: React.FC<IChatPanelHeaderWrapper> = ({ children, ...props }) => {
    return (
        <div {...props} className={cn("bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg w-full border-l-[1px] min-h-[48px] max-h-[48px] border-l-gray-100 px-4 py-2 dark:border-l-gray-800", props.className)} >
            {children}
        </div>
    );
};

export default ChatPanelHeaderWrapper;
