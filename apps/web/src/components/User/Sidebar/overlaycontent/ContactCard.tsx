import React, { FC } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import { cn } from '@/utils/cn';

interface ContactCardProps extends AvatarProps {
    name: string;
    onClick?: () => void;
}

const ContactCard: FC<ContactCardProps> = ({
    name,
    onClick,
    user_id,
    for_other,
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                'dark:bg-whatsapp-dark-primary_bg group relative flex w-full px-2 dark:text-white',
                ' hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-secondary_bg cursor-pointer',
            )}
        >
            <span className="py-4">
                <Avatar user_id={user_id} for_other={for_other} name={name} height={55} width={55} />
            </span>
            <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full place-items-center  justify-between border-b-[1px] px-3">
                <div className="flex flex-col justify-evenly">
                    {name}
                </div>

            </div>
        </div>
    );
};

export default ContactCard;
