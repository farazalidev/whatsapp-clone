import useSocket from '@/hooks/useSocket';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ICallStatus, IOnCallOffer } from '../../../../../../../shared/types/call.types';
import { useSelector } from 'react-redux';
import { RootState, store } from '@/global/store';
import { openCallPanel } from '@/global/features/callSlice';
import { RTC_Config } from '@/config/rtc.config';
import OptionIcon from '../../Sidebar/OptionIcon';
import useMoveable from '@/hooks/useMoveable';

const CallPanel = () => {
    useMoveable('call-box');

    const peer = useRef<RTCPeerConnection>();

    const { socket } = useSocket();

    const { Me } = useSelector((state: RootState) => state.UserSlice);

    const [callOffer, setCallOffer] = useState<IOnCallOffer>();

    const { callReceiver, callType, isOpen } = useSelector((state: RootState) => state.CallSlice);

    const [callStatus, setCallStatus] = useState<ICallStatus>(callType == 'offer' ? 'offline' : 'pending');

    const userVideRef = useRef<HTMLVideoElement>(null);
    const userStreamRef = useRef<MediaStream>();

    const remoteVideRef = useRef<HTMLVideoElement>(null);
    const remoteStreamRef = useRef<MediaStream>();

    const getUserStream = useCallback(async () => {
        if (!peer.current) peer.current = new RTCPeerConnection(RTC_Config);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        userStreamRef.current = stream;
        if (userVideRef.current) userVideRef.current.srcObject = stream;

        if (peer.current) {
            // adding tracks to peer
            stream.getTracks().forEach((track) => {
                if (peer.current) peer.current.addTrack(track, stream);
            });

            peer.current.onicecandidate = (e) => {
                if (e.candidate) {
                    if (callType === 'offer' && callReceiver) {
                        socket.emit('icecandidate', { candidate: e.candidate, to: callReceiver });
                    }
                    if (callType === 'answer' && callOffer?.from) {
                        socket.emit('icecandidate', { candidate: e.candidate, to: callOffer.from });
                    }
                }
            };

            peer.current.ontrack = (e) => {
                console.log('🚀 ~ getUserStream ~ e:', e.streams[0]);
                if (e.streams && remoteVideRef.current) {
                    remoteVideRef.current.srcObject = e.streams[0];
                }
            };
        }
    }, [callOffer?.from, callReceiver, callType, socket]);

    const answerCall = useCallback(async () => {
        try {
            if (callOffer?.from && callOffer.offer) {
                await getUserStream();

                await peer.current?.setRemoteDescription(new RTCSessionDescription(callOffer.offer));
                const ans = await peer.current?.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true });

                if (ans) {
                    await peer.current?.setLocalDescription(new RTCSessionDescription(ans));
                    socket.emit('acceptAnswer', { ans, to: callOffer.from });
                    setCallStatus('accepted');
                } else {
                    throw new Error('Unable to create ans');
                }
            } else {
                throw new Error('call offer not received');
            }
        } catch (error) {
            console.log('🚀 ~ answerCall ~ error:', error);
        }
    }, [callOffer?.from, callOffer?.offer, getUserStream, socket]);

    const createOffer = useCallback(async () => {
        try {
            await getUserStream();
            const offer = await peer.current?.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            if (offer && callReceiver && Me) {
                await peer.current?.setLocalDescription(new RTCSessionDescription(offer));
                socket.emit('offerCall', { callee: callReceiver, caller: Me, offer });
                socket.on('callStatus', (status) => {
                    setCallStatus(status);
                });
            } else {
                throw new Error('Failed to create offer');
            }
        } catch (error) {
            console.log('🚀 ~ createOffer ~ error:', error);
        }
    }, [Me, callReceiver, getUserStream, socket]);

    useEffect(() => {
        socket.on('onCallOffer', (offer) => {
            if (Me) {
                setCallOffer(offer);
                store.dispatch(openCallPanel({ callReceiver: Me, callType: 'answer' }));
            }
        });

        socket.on('onAcceptAnswer', async (payload) => {
            if (payload.acceptorSdp) {
                await peer.current?.setRemoteDescription(new RTCSessionDescription(payload.acceptorSdp));
                setCallStatus('accepted');
            }
        });
    }, [Me, socket]);

    useEffect(() => {
        const init = async () => {
            if (callType === 'offer' && isOpen) {
                await createOffer();
            }
        };
        init();
    }, [callType, createOffer, isOpen]);

    useEffect(() => {
        if (isOpen) {
            socket.on('onIceCandidate', (candidate) => {
                peer.current?.addIceCandidate(candidate);
            });
        }
    }, [isOpen, socket]);

    return (
        <div id="call-box" className={`absolute h-[50%] w-[50%] bg-white ${isOpen ? 'block' : 'hidden'} group/main flex flex-col overflow-hidden rounded-lg`}>
            <div className="relative h-full flex-1 rounded-lg">
                <div className="group/my-video absolute z-10 m-1 rounded-lg ">
                    {callStatus !== "accepted" ? <video autoPlay ref={userVideRef} className="rounded-lg border h-full w-full" /> :
                        <video autoPlay ref={userVideRef} height={150} width={200} className="rounded-lg border" />}
                    <span className="invisible absolute bottom-0 text-white group-hover/my-video:visible">Controls</span>
                </div>

                <video autoPlay ref={remoteVideRef} className="relative rounded-lg" playsInline />
                {callType === 'offer' ? (
                    <div
                        className={`bg-whatsapp-misc-whatsapp_primary_green_light z-10 flex h-16 w-full place-items-center justify-center gap-5 rounded-lg transition-all  ${callStatus !== "accepted" ? "bottom-0" : "absolute -bottom-[100%] group-hover/main:bottom-0"}`}
                    >
                        <OptionIcon src='icons/camera-on.svg' />
                        <OptionIcon src='icons/call-mic-on.svg' />
                        <OptionIcon src="icons/call/end-call-icon.svg" height={40} width={40} onClick={() => {
                            console.log("reject call");
                        }} />
                    </div>
                ) : callType === 'answer' && callStatus === 'pending' ? (
                    <div
                        className={`bg-whatsapp-misc-whatsapp_primary_green_light absolute -bottom-[100%] z-10 flex h-16 w-full place-items-center justify-center gap-5 rounded-lg transition-all group-hover/main:bottom-0`}
                    >
                        <OptionIcon src="icons/call/accept-call-icon.svg" height={40} width={40} onClick={answerCall} />
                        <OptionIcon src="icons/call/end-call-icon.svg" height={40} width={40} onClick={() => {
                            console.log("reject call");
                        }} />
                    </div>
                ) : callType === 'answer' && callStatus === 'accepted' ? (
                    <div
                        className={`bg-whatsapp-misc-whatsapp_primary_green_light absolute -bottom-[100%] z-10 flex h-16 w-full place-items-center justify-center gap-5 rounded-lg transition-all group-hover/main:bottom-0`}
                    >
                        <OptionIcon src="/icons/call-mic-on.svg" height={40} width={40} />
                        <OptionIcon src="/icons/camera-on.svg" height={40} width={40} />
                        <OptionIcon src="icons/call/end-call-icon.svg" height={40} width={40} />
                    </div>
                ) : null}
            </div>

            {/* {callType === 'answer' ? (
                <div className='flex justify-center place-items-center gap-5 h-[20%] bg-whatsapp-misc-whatsapp_primary_green_light'>
                    <OptionIcon src='icons/call/end-call-icon.svg' />
                    <OptionIcon src="icons/call/accept-call-icon.svg" onClick={answerCall} />
                </div>
            ) : callType === 'offer' ? (
                <div className='flex justify-center place-items-center gap-5 h-[20%] bg-whatsapp-misc-whatsapp_primary_green_light'>
                    <OptionIcon src='/icons/call-mic-on.svg' />
                    <OptionIcon src='/icons/camera-on.svg' />
                    <OptionIcon src='icons/call/end-call-icon.svg' />
                </div>
            ) : null} */}
        </div>
    );
};

export default CallPanel;
