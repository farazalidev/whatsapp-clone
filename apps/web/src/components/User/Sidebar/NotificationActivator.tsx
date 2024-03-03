'use client';
import React, { useState } from 'react';
import OptionIcon from './OptionIcon';
import { setCookie, getCookie } from 'cookies-next';
import { Mutation } from '@/utils/fetcher';
import { urlBase64ToUint8Array } from '@/utils/urlBase64ToUint8Array';
import { toast } from 'sonner';

const NotificationActivator = () => {
    const bgSyncCookie = getCookie('ask-bg_sync');
    const shouldAsk = bgSyncCookie ? bgSyncCookie : 'true';
    const [show, setShow] = useState<boolean>(shouldAsk === 'true' ? true : false);

    function arrayBufferToBase64(buffer: ArrayBuffer | null) {
        let binary = '';
        if (buffer) {
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
        return {};
    }

    const handleRegistration = () => {
        if ('serviceWorker' in navigator) {
            try {
                const handleServiceWorker = async () => {
                    const register = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                    try {
                        await navigator.serviceWorker.ready;

                        const subscription = await register.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_ID),
                        });

                        await Mutation('/subscribe', {
                            endpoint: subscription.endpoint,
                            auth: arrayBufferToBase64(subscription.getKey('auth')),
                            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
                        });
                        setCookie('ask-bg_sync', false);
                        setShow(false);
                    } catch (error) {
                        console.log('🚀 ~ handleServiceWorker ~ error:', error);
                        await register.unregister();
                    }
                };
                handleServiceWorker();
            } catch (error) {
                toast.error('Error while subscribing to notifications');
            }
        }
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setCookie('ask-bg_sync', false);
        setShow(false);
    };

    return show ? (
        <button
            className={`bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg dark:border-whatsapp-dark-text border-whatsapp-light-text flex w-full cursor-pointer place-items-center justify-between border-b-[1px] border-opacity-10 p-3 dark:border-opacity-10`}
            onClick={handleRegistration}
            title="Allow"
        >
            <div className="flex h-16 place-items-center gap-3 ">
                <div className="min-w-14">
                    <OptionIcon src="/icons/alert-notification.svg" height={50} width={50} />
                </div>
                <div className="flex flex-col text-left">
                    <div className="text-whatsapp-light-text dark:text-whatsapp-dark-text line-clamp-1 text-[15px] text-opacity-80 dark:text-opacity-80">
                        Turn on background sync
                    </div>
                    <div className="text-whatsapp-light-text dark:text-whatsapp-dark-text line-clamp-2 text-[13px] text-opacity-50 dark:text-opacity-50">
                        Get faster performance by syncing messages in the background.
                    </div>
                </div>
            </div>
            <button
                onClick={handleCancel}
                className="hover:bg-whatsapp-light-secondary_bg dark:hover:bg-whatsapp-dark-primary_bg cursor-pointer rounded-full p-1"
                title="close"
            >
                <OptionIcon src="/icons/cross.svg" />
            </button>
        </button>
    ) : null;
};

export default NotificationActivator;
