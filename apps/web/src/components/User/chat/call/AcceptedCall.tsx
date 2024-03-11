import React, { FC, RefObject, useState } from 'react'
import OptionIcon from '../../Sidebar/OptionIcon'
import { CallMode } from '../../../../../../../shared/types/call.types'
import { MediaState } from './CallPanel'
import useMoveable from '@/hooks/useMoveable';
import Avatar from '../../Avatar';
import Typography from '@/Atoms/Typography/Typography';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { formatSeconds } from '@/utils/call/formateSeconds';

interface AcceptCallProps {
    callReceiver: UserEntity | undefined
    onMicToggle: () => void
    onCameraToggle: () => void
    onSpeakerToggle: () => void
    onEndCall: () => void
    userVideoRef?: RefObject<HTMLVideoElement>
    remoteVideRef?: RefObject<HTMLVideoElement>
    callMode: CallMode
    mediaState: MediaState
    show: boolean
}

const AcceptedCall: FC<AcceptCallProps> = ({ onCameraToggle, onMicToggle, onSpeakerToggle, onEndCall, callMode, mediaState, remoteVideRef, userVideoRef, show, callReceiver }) => {

    useMoveable(callMode === "video" ? "video-call-box" : "voice-call-box");

    const [callDuration, setCallDuration] = useState(0)

    return (
        <>
            <div id='video-call-box' style={{ display: show && callMode === "video" ? "block" : "none" }} className='min-w-[700px] max-w-[1000px] w-[50%] min-h-[600px] max-h-[600px] h-[50%] absolute flex flex-col group/accepted-call rounded-lg overflow-hidden'>
                <div className='h-full relative'>
                    {/* remote stream */}
                    <video muted autoPlay ref={remoteVideRef} className="absolute h-full w-full object-cover rounded-lg" />
                    {/* user stream */}
                    <video ref={userVideoRef} muted autoPlay className='absolute top-2 left-2 w-[200px] h-[150px] object-cover rounded-lg' ></video>
                </div>
                <div className='h-[20%] flex place-items-center justify-center gap-10 absolute transition-all -bottom-[100%] w-full  group-hover/accepted-call:bottom-0 bg-whatsapp-dark-primary_bg bg-opacity-50 rounded-lg'>
                    {mediaState.speakerIsOn ?
                        <OptionIcon src='icons/call/speaker on.svg' width={45} height={45} onClick={onSpeakerToggle} /> :
                        <OptionIcon src='icons/call/speaker-off.svg' width={45} height={45} onClick={onSpeakerToggle} />}
                    {mediaState.cameraIsOn ?
                        <OptionIcon src='icons/camera-on.svg' width={45} height={45} onClick={onCameraToggle} /> : <OptionIcon src='icons/camera-off.svg' width={45} height={45} onClick={onCameraToggle} />}

                    {mediaState.micIsOn ?
                        <OptionIcon src='icons/call-mic-on.svg' width={45} height={45} onClick={onMicToggle} /> :
                        <OptionIcon src='icons/call-mic-off.svg' width={45} height={45} onClick={onMicToggle} />}
                    <OptionIcon src='icons/call/end-call-icon.svg' width={45} height={45} className='bg-white rounded-full' onClick={onEndCall} />
                </div>

            </div>

            <div id='voice-call-box' style={{ display: show && callMode === "voice" ? "block" : "none" }} className='absolute flex flex-col rounded-lg min-h-[500px] max-h-[700px] h-[50%] min-w-[500px] max-w-[700px] w-[50%] bg-white '>
                <div className='bg-whatsapp-misc-sideBarOverlayHeaderLightBg flex flex-col h-[85%] justify-center place-items-center gap-2 rounded-t-lg'>
                    <Avatar height={200} width={200} user_id={callReceiver?.user_id} />
                    <Typography level={4}>{callReceiver?.name}</Typography>
                    <Typography>{formatSeconds(callDuration)}</Typography>
                    <audio ref={remoteVideRef} autoPlay controls hidden onTimeUpdate={(e) => {
                        setCallDuration(e.currentTarget.currentTime)
                    }} />
                </div>
                <div className='h-[15%] bg-whatsapp-dark-secondary_bg flex justify-center place-items-center gap-5 rounded-b-lg'>
                    {mediaState.speakerIsOn ?
                        <OptionIcon src='icons/call/speaker on.svg' width={45} height={45} onClick={onSpeakerToggle} /> :
                        <OptionIcon src='icons/call/speaker-off.svg' width={45} height={45} onClick={onSpeakerToggle} />}

                    {mediaState.micIsOn ?
                        <OptionIcon src='icons/call-mic-on.svg' width={45} height={45} onClick={onMicToggle} /> :
                        <OptionIcon src='icons/call-mic-off.svg' width={45} height={45} onClick={onMicToggle} />}
                    <OptionIcon src='icons/call/end-call-icon.svg' width={45} height={45} className='bg-white rounded-full' onClick={onEndCall} />
                </div>
            </div>
        </>
    )
}

export default AcceptedCall
