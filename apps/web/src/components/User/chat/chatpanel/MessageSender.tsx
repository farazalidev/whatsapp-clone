import React, { ChangeEvent, FormEvent, useState } from 'react';
import OptionIcon from '../../Sidebar/OptionIcon';
import MessageInput from '@/Atoms/Input/MessageInput';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '@/hooks/useSocket';
import { RootState } from '../../../../global/store';
import Attachments from './Attachments';
import { sendMessageFn } from '@/utils/sendMessageFn';
import { toast } from 'sonner';
import { v4 } from 'uuid';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import useCurrentChat from '@/hooks/useCurrentChat';
import { toggleVoiceMessagePanelOverlay } from '@/global/features/overlaySlice';
import VoiceMessagePanel from './VoiceMessagePanel';
import MessageSenderWrapper from './MessageSenderWrapper';
import { checkAudioDevice } from '@/utils/checkAudioDevice';
import { openInstructionModal } from '@/global/features/ModalSlice';
import useColorScheme from '@/hooks/useColorScheme';

const MessageSender = ({ receiver_id, chat_id }: { receiver_id: string; chat_id: string | undefined }) => {
  const theme = useColorScheme()

  const dispatch = useDispatch();

  const isVoicePanelOpen = useSelector((state: RootState) => state.overlaySlice.voiceMessagePanelIsOpen);

  const { message_input_loading } = useSelector((state: RootState) => state.LoadingSlice);

  const { Me } = useSelector((state: RootState) => state.UserSlice);

  const { socket } = useSocket();

  const [typing, setTyping] = useState(false);

  const [messageValue, setMessageValue] = useState<string>();

  const { raw_chat } = useCurrentChat();

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
    if (!typing) {
      setTyping(true);

      socket.emit('typing', { chat_id: chat_id as string, user_id: Me?.user_id as string });
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit(`stop_typing`, { chat_id: chat_id as string, user_id: Me?.user_id as string });
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
      const newMessage: MessageEntity = {
        content: messageValue as string,
      sended_at: new Date().toISOString() as any,
      messageType: 'text',
      media: null,
      is_seen: false,
      id: v4(),
      received_at: null,
      seen_at: null,
      from: Me as any,
      clear_for: null,
      sended: false,
        chat: { chat_for: raw_chat?.chat_for as any, chat_with: raw_chat?.chat_with as any, id: raw_chat?.id as any, },
    };
    const isSended = await sendMessageFn({ socket, message: newMessage });
    if (!isSended) {
      toast('Failed to send Message', { position: 'top-center' });
      setMessageValue('');
    }
    setMessageValue('');
  };

  const handleVoiceMessagePanel = () => {
    checkAudioDevice().then((result) => {
      if (result === 'Success: Audio device connected') {
        dispatch(toggleVoiceMessagePanelOverlay());
      } else if (result === 'Fail: No audio device connected') {
        dispatch(openInstructionModal('Audio Device Not found'));
      } else if (result === 'Denied: Permission denied for audio device') {
        dispatch(openInstructionModal('Audio device Permission denied'));
      } else if (result === 'Fail: MediaDevices API not supported') {
        dispatch(openInstructionModal('Audio Device Not supported'));
      } else {
        return
      }
    });
  };

  return isVoicePanelOpen ? (
    <MessageSenderWrapper>
      {' '}
      <VoiceMessagePanel />
    </MessageSenderWrapper>
  ) : (
    <form
      onSubmit={(e) => handleSendMessage(e)}
        className="bg-whatsapp-light-sender_bg dark:bg-whatsapp-dark-sender_bg flex min-h-[57px] place-items-center justify-between gap-[16px] px-[20px] py-[5px]"
    >
      <>
        <Attachments />
        <span className="w-full">
          <MessageInput onChange={handleMessageChange} value={messageValue} />
        </span>
        <span>
          {messageValue ? (
            <>
              <button type="submit" disabled={message_input_loading}>
                  {theme === "dark" ?
                    <OptionIcon src="/icons/send.svg" tooltip="" /> : <OptionIcon src="/icons/send -light.svg" tooltip="" />}
              </button>
            </>
          ) : (
            <OptionIcon src="/icons/mic.svg" tooltip="" onClick={handleVoiceMessagePanel} />
          )}
        </span>
      </>
    </form>
  );
};

export default MessageSender;
