import { IMessageBubblePreview } from '@/Atoms/types/messageBubble.types'
import Avatar from '@/components/User/Avatar'
import VoiceMessagePlayer from '@/components/User/chat/chatpanel/Audio/VoiceMessagePlayer'
import useHandleVoiceMessage from '@/hooks/useHandleVoiceMessage'
import React, { FC } from 'react'

const MessageBubbleVoicePreview: FC<IMessageBubblePreview> = ({ ChatSlice, Me, isFromMe, message, receiver_id, socket }) => {

    const { isLoading, voiceMessageUrl } = useHandleVoiceMessage({ message, Me, ChatSlice, receiver_id, socket, isFromMe })

    const sender_id = message?.from.user_id === Me?.user_id ? Me?.user_id : receiver_id

    return (
        <div className={`relative flex h-fit w-fit max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] ${isFromMe
            ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
            : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
            }`}>
            <Avatar user_id={sender_id} />
            <div>
                <VoiceMessagePlayer key={message?.id} url={voiceMessageUrl as string} id={message?.id as string} barColor='white' barGap={1} barWidth={3} color='white' height={50} width={200} loading={isLoading} progressColor='gray' />
            </div>
        </div>
    )
}

export default MessageBubbleVoicePreview
