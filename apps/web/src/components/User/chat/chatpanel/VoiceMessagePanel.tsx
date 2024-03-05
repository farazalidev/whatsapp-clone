import React, { useCallback, useEffect, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import { LiveAudioVisualizer } from './Audio/LiveAudioVisualizer/LiveAudioVisualizer';
import useVoiceRecorder from './Audio/useVoiceRecorder';
import { convertSeconds } from './Audio/formateSeconds';
import Typography from '@/Atoms/Typography/Typography';
import Player from './Audio/Player';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { v4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import useCurrentChat from '@/hooks/useCurrentChat';
import { addNewMessage } from '@/global/features/messagesSlice';
import { toggleVoiceMessagePanelOverlay } from '@/global/features/overlaySlice';
import { mainDb } from '@/utils/indexedDb/mainIndexedDB';
import { calculateChecksumPromise } from '../../../../utils/file/calculateFileChecksum';

const VoiceMessagePanel = () => {
    const dispatch = useDispatch();

    const { mediaRecorder, start, time, pauseResume, isPaused, stop, chunks, error } = useVoiceRecorder();

    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const { raw_chat } = useCurrentChat();

    const { Me } = useSelector((state: RootState) => state.UserSlice);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (chunks && !loading) {
            const blob = new Blob(chunks, { type: "audio/webm" })
            setAudioUrl(URL.createObjectURL(blob));
        }
    }, [chunks, loading]);

    const handleStop = useCallback(() => {
        pauseResume();
    }, [pauseResume]);

    const handleRecord = useCallback(() => {
        pauseResume();
    }, [pauseResume]);

    const handleDelete = () => {
        dispatch(toggleVoiceMessagePanelOverlay());
    };

    const handleSend = useCallback(async function () {
        try {
            setLoading(true)
            stop()
            if (raw_chat && Me && chunks) {
                const messageId = v4();
                const mediaId = v4();
                const audioFile = new File([...chunks], mediaId, { type: 'webm' });
                const message: MessageEntity = {
                    chat: { chat_for: raw_chat?.chat_for, chat_with: raw_chat?.chat_with, id: raw_chat?.id, },
                    clear_for: null,
                    from: Me,
                    id: messageId,
                    is_seen: false,
                    messageType: 'audio',
                    seen_at: null,
                    sended: false,
                    sended_at: new Date(),
                    received_at: null,
                    media: {
                        ext: '.webm',
                        height: null,
                        width: null,
                        id: mediaId,
                        mime: 'audio/webm',
                        path: mediaId,
                        type: 'audio',
                        size: audioFile.size,
                    },
                };
                const checksum = await calculateChecksumPromise(audioFile);
                await mainDb.media.add({ file: audioFile, fileChecksum: checksum, mime: 'audio/webm', id: mediaId, type: 'audio', original_name: mediaId });
                dispatch(addNewMessage({ chat_id: raw_chat.id, message }));
                dispatch(toggleVoiceMessagePanelOverlay());
            }
        } catch (error) {
            dispatch(toggleVoiceMessagePanelOverlay());
        } finally {
            setLoading(false)
        }
    }, [Me, chunks, dispatch, raw_chat, stop]);

    console.log(error);


    return (
        <div className="flex h-full w-full place-items-center justify-end">
            <span className=" flex h-full max-h-[57px] w-full max-w-[420px] place-items-center justify-between">
                <OptionIcon src="/icons/voice recorder/basket.svg" height={20} width={20} onClick={handleDelete} />
                <div className="flex h-full w-[300px] place-items-center">
                    {mediaRecorder && !isPaused ? (
                        <div className="flex place-items-center gap-2">
                            <Typography>{convertSeconds(time)}</Typography>
                            <LiveAudioVisualizer mediaRecorder={mediaRecorder} height={40} width={220} barColor="white" gap={3} barWidth={4} />
                        </div>
                    ) : audioUrl && !loading ? (
                        <Player url={audioUrl} />
                    ) : null}
                </div>

                {isPaused ? (
                    <OptionIcon src="/icons/voice recorder/mic.svg" onClick={handleRecord} height={40} width={40} />
                ) : (
                    <OptionIcon src="/icons/voice recorder/stop.svg" onClick={handleStop} height={40} width={40} />
                )}

                {loading ?
                    <OptionIcon src='/icons/spinner.svg' /> :
                    <OptionIcon src="/icons/voice recorder/send.svg" onClick={handleSend} height={40} width={40} />}
            </span>
        </div>
    );
};

export default VoiceMessagePanel;
