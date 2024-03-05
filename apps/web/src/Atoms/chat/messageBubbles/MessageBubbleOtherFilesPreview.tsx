import { IMessageBubblePreview } from '@/Atoms/types/messageBubble.types';
import { FC, useCallback } from 'react';
import MediaMessageStatus from './MediaMessageStatus';
import Image from 'next/image';
import { convertFileSizeFromBytes } from '@/utils/getFIleSizeFromBytes';
import { clampString } from '@/utils/clamp';
import ProgressBar from '@/Atoms/misc/ProgressBar';
import useUpload from '@/hooks/useUpload';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useCurrentChat from '@/hooks/useCurrentChat';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import useColorScheme from '@/hooks/useColorScheme';

export const MessageBubbleOtherFilesPreview: FC<IMessageBubblePreview> = ({ message, isFromMe, Me, socket }) => {
    const theme = useColorScheme();
    const { raw_chat } = useCurrentChat();

    const lastAction = useCallback(() => {
        const lastAction = async () => {
            if (message && raw_chat) {
                const messageToSend: MessageEntity = {
                    id: message.id,
                    chat: { chat_for: raw_chat?.chat_for, chat_with: raw_chat?.chat_with, id: raw_chat?.id, },
                    clear_for: null,
                    content: message?.content,
                    from: Me as any,
                    is_seen: false,
                    media: { ...(message?.media as any), path: `${Me?.user_id}/${message?.media?.id}` },
                    messageType: message.messageType,
                    received_at: null,
                    seen_at: null,
                    sended: false,
                    sended_at: new Date(),
                };
                const sended = await sendMessageFn({ message: messageToSend, socket });
                if (sended) {
                    await mainDb.media.delete(message.media?.id as string);
                    await mainDb.mediaMessages.delete(message.id);
                }
            }
        };
        return lastAction();
    }, [Me, message, raw_chat, socket]);

    const { state, cancel, download, retry } = useUpload({ isFromMe, message, lastAction });

    // manual upload
    const handleRetry = () => {
        retry();
    };
    const handlePause = () => {
        cancel();
    };

    const handleDownload = () => {
        download();
    };

    return (
        <div
            className={`bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark flex ${isFromMe ? 'h-[100px]' : ''} w-[350px] flex-col rounded-md p-1 ${isFromMe
                ? 'bg-whatsapp-misc-my_message_bg_light dark:bg-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text '
                : 'bg-whatsapp-misc-other_message_bg_light dark:bg-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
                } `}
        >
            <div className={`flex-1/3 flex h-fit place-items-center justify-between rounded-md ${isFromMe ? 'p-1 bg-black bg-opacity-10' : 'p-2'}`}>
                <div className="flex place-items-center gap-2 p-2">
                    {theme === 'dark' ? (
                        <Image src={'/icons/preview-generic.svg'} width={40} height={50} alt="file" />
                    ) : (
                        <Image src={'/icons/file-light.png'} width={40} height={50} alt="file" />
                    )}
                    <div className="text-whatsapp-light-text dark:text-whatsapp-dark-text flex flex-col gap-2 text-opacity-80">
                        <span className="line-clamp-1 text-sm">{clampString(message?.media?.original_name || 'file', 25)}</span>
                        <span className="text-whatsapp-light-text flex gap-1 text-xs dark:text-[#86a3b3]">
                            <span>{message?.media?.ext}</span>
                            <span>{convertFileSizeFromBytes(message?.media?.size || 0, '•')}</span>
                        </span>
                    </div>
                </div>
                <span className="flex place-items-center justify-center">
                    {/* progress bar */}
                    <ProgressBar
                        barStyle="circle"
                        isResumable={state?.isResumable}
                        isLoading={state?.isLoading}
                        progress={state?.progress}
                        showActionButton
                        onRetryClick={handleRetry}
                        onPauseClick={handlePause}
                        onActionButtonClick={handleDownload}
                        messageType={message?.messageType}
                        isFromMe={isFromMe}
                    />
                </span>
            </div>
            {isFromMe ? (
                <div className="flex-1/3 relative h-[30%]">
                    <MediaMessageStatus isFromMe={isFromMe} message={message} />
                </div>
            ) : null}
        </div>
    );
};
