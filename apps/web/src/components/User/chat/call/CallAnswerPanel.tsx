import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { CallMode } from '../../../../../../../shared/types/call.types';
import Avatar from '../../Avatar';
import Typography from '@/Atoms/Typography/Typography';
import OptionIcon from '../../Sidebar/OptionIcon';
import useMoveable from '@/hooks/useMoveable';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { toast } from 'sonner';

interface ICallAnswerPanel {
  callMode: CallMode;
  caller: UserEntity | undefined
  callEndCallBack: () => Promise<void> | void;
  callAcceptCallBack: () => void | Promise<void>
  show: boolean
}

const CallAnswerPanel: FC<ICallAnswerPanel> = ({ callMode, callEndCallBack, callAcceptCallBack, show, caller }) => {
  console.log(caller);

  useMoveable('call-answer-panel')

  const userVideoRef = useRef<HTMLVideoElement>(null);

  const getUserStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callMode === "video" ? true : false });
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
    } catch (error) {
      toast("Permission denied, If u want to accept call then reset the permissions", { position: "top-right", duration: 5000 })
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
    <div id='call-answer-panel' style={{ display: show ? "block" : "none" }} className="absolute flex h-full w-full place-items-center justify-center">
      {callMode === 'video' ? (
        <div className='min-h-[500px] w-[700px] relative flex justify-center place-items-center rounded-lg select-none'>
          <div className="absolute w-full h-full  bg-black bg-opacity-50 rounded-lg z-10" />
          <div className="bg-whatsapp-dark-secondary_bg absolute bottom-2 flex h-[100px] w-[80%] place-items-center rounded-lg bg-opacity-90 p-2 z-20">
            <div className="flex w-full place-items-center justify-between">
              <div className="flex place-items-center justify-center gap-2">
                <Avatar user_id={caller?.user_id} />
                <Typography>{caller?.name}</Typography>
              </div>
              <div className="flex place-items-center gap-2">
                <OptionIcon src="icons/call/accept-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callAcceptCallBack} />
                <OptionIcon src="icons/call/end-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callEndCallBack} />
              </div>
            </div>
          </div>
          <video muted autoPlay ref={userVideoRef} className="absolute h-full w-full object-cover rounded-lg" />
        </div>
      ) : (
          <div className="bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg absolute flex h-[100px] min-w-[400px] max-w-[500px] w-[30%] place-items-center rounded-lg p-2 border border-whatsapp-light-text dark:border-whatsapp-dark-text select-none"  >
          <div className="flex w-full place-items-center justify-between">
            <div className="flex place-items-center justify-center gap-2">
                <Avatar user_id={caller?.user_id} />
              <Typography>{caller?.name}</Typography>
            </div>
            <div className="flex place-items-center gap-2">
              <OptionIcon src="icons/call/accept-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callAcceptCallBack} />
              <OptionIcon src="icons/call/end-call-icon.svg" height={45} width={45} className="rounded-full bg-white" onClick={callEndCallBack} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CallAnswerPanel);
