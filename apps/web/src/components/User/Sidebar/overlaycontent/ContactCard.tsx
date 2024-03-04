import React, { FC } from 'react';
import Avatar, { AvatarProps } from '../../Avatar';
import { cn } from '@/utils/cn';
import { ContactEntity } from '@server/modules/user/entities/contact.entity';

interface ContactCardProps extends AvatarProps {
    onClick?: () => void;
    contact: ContactEntity
}

const ContactCard: FC<ContactCardProps> = ({
    contact,
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
                <Avatar user_id={user_id} for_other={for_other} name={contact.contact?.name} height={55} width={55} />
            </span>
            <div className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex w-full justify-center border-b-[1px] px-3 flex-col">
                <div className="flex flex-col justify-evenly">
                    {contact.contact?.name}
                </div>
                <span className='text-whatsapp-light-text dark:text-whatsapp-dark-text text-opacity-50 dark:text-opacity-50'>
                    {contact.contact?.profile?.about}
                </span>
            </div>
        </div>
    );
};

export default ContactCard;
