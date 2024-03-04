import React, { FC } from 'react';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import OptionIcon from '@/components/User/Sidebar/OptionIcon';
import useColorScheme from '@/hooks/useColorScheme';

interface IMessageStatus {
    message: MessageEntity | undefined;
}

const MessageStatus: FC<IMessageStatus> = ({ message }) => {
    const theme = useColorScheme();

    return (
        <span className="flex place-items-center ">
            {message?.seen_at ? (
                // Render the icon for seen messages
                <OptionIcon src="/icons/seen.svg" height={18} width={18} />
            ) : message?.received_at ? (
                // Render the icon for received messages
                <OptionIcon src="/icons/sended.svg" height={18} width={18} />
            ) : message?.sended ? (
                        // Render the icon for sent messages
                        theme === 'dark' ? (
                            <OptionIcon src="/icons/msg-check.svg" height={18} width={18} />
                        ) : (
                            <OptionIcon src="/icons/msg-check-light.svg" height={15} width={15} />
                        )
                    ) : (
                // Render the loading icon for other cases
                <OptionIcon src="/icons/status-time.svg" height={15} width={15} />
            )}
        </span>
    );
};

export default MessageStatus;
