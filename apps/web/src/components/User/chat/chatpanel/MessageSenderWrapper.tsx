import React, { FC, ReactNode } from 'react'

interface IMessageSenderWrapperProps {
    children: ReactNode
}

const MessageSenderWrapper: FC<IMessageSenderWrapperProps> = ({ children }) => {
    return (
        <div className="bg-whatsapp-light-sender_bg dark:bg-whatsapp-dark-sender_bg flex place-items-center justify-between gap-[16px] px-[20px] py-[5px] min-h-[57px]">
            {children}
        </div>
    )
}

export default MessageSenderWrapper
