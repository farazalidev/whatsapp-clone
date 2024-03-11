import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { CallMode, ICallStatus } from '../../../../../../../shared/types/call.types';
import Avatar from '../../Avatar';
import Typography from '@/Atoms/Typography/Typography';
import OptionIcon from '../../Sidebar/OptionIcon';
import useMoveable from '@/hooks/useMoveable';
import { toast } from 'sonner';
import { UserEntity } from '@server/modules/user/entities/user.entity';

interface ICallAnswerPanel {
  callMode: CallMode;
  callStatus: ICallStatus | undefined;
  callEndCallBack: () => Promise<void> | void;
  to: UserEntity | undefined;
}

const CallAwaitingPanel: FC<ICallAnswerPanel> = ({ callMode, callEndCallBack, callStatus, to }) => {
  useMoveable('call-awaiting-panel');

  const userVideoRef = useRef<HTMLVideoElement>(null);

  const getUserStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callMode == 'video' ? true : false });
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
    } catch (error) {
      toast('Permission denied \nIf u want to make a call then reset the permissions', { position: 'top-right', duration: 5000 });
      await callEndCallBack();
    }
  }, [callEndCallBack, callMode]);

  useEffect(() => {
    const init = async () => {
      await getUserStream();
    };
    init();
  }, []);

  return (
    <div id="call-awaiting-panel" className="relative flex h-full w-full place-items-center justify-center">
      {callMode === 'video' ? (
        <div className="relative flex min-h-[500px] w-[700px] select-none place-items-center justify-center rounded-lg">
          <div className="absolute z-10 flex h-full w-full place-items-center justify-center rounded-lg bg-black bg-opacity-50">
            <Typography>{callStatus === 'online' ? 'Ringing' : 'Calling'}</Typography>
          </div>
          <div className="bg-whatsapp-dark-secondary_bg absolute bottom-0 z-20 flex h-[100px] w-full place-items-center justify-center rounded-lg bg-opacity-90 p-2">
            <div className="flex place-items-center gap-2">
              <OptionIcon src="icons/call/end-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callEndCallBack} />
            </div>
          </div>
          <video muted autoPlay ref={userVideoRef} className="absolute h-full w-full rounded-lg object-cover" />
        </div>
      ) : (
        <div
          id="call-awaiting-panel"
            className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg absolute flex h-[100px] w-[30%] min-w-[400px] max-w-[500px] select-none place-items-center rounded-lg border border-whatsapp-light-text dark:border-whatsapp-dark-text bg-opacity-90 p-2"
        >
          <div className="flex w-full place-items-center justify-between">
              <div className="flex place-items-center gap-3">
                <Avatar user_id={to?.user_id} />
                <Typography level={3}>{to?.name}</Typography>
              </div>
              <Typography className='bg-whatsapp-misc-my_message_bg_dark p-1 rounded-lg'> {callStatus === 'online' ? 'Ringing' : 'Calling'}</Typography>
            <div className="flex place-items-center gap-2">
              <OptionIcon src="icons/call/end-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callEndCallBack} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CallAwaitingPanel);
