import useSocket from '@/hooks/useSocket';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ICallStatus, IOnCallOffer } from '../../../../../../../shared/types/call.types';
import { useSelector } from 'react-redux';
import { RootState, store } from '@/global/store';
import { closeCallPanel, openCallPanel } from '@/global/features/callSlice';
import { RTC_Config } from '@/config/rtc.config';
import AcceptedCall from './AcceptedCall';
import CallAnswerPanel from './CallAnswerPanel';
import CallAwaitingPanel from './CallAwaitingPanel';
import { wait } from '@/utils/wait';

export interface MediaState {
    micIsOn: boolean
    cameraIsOn: boolean
    speakerIsOn: boolean
}

const CallPanel = () => {
    const peer = useRef<RTCPeerConnection>();

    const { socket } = useSocket();

    const { Me } = useSelector((state: RootState) => state.UserSlice);

    const [callOffer, setCallOffer] = useState<IOnCallOffer>();

    const { callReceiver, callType, isOpen, callMode } = useSelector((state: RootState) => state.CallSlice);

    const [mediaState, setMediaState] = useState<MediaState>({ cameraIsOn: true, micIsOn: true, speakerIsOn: true })

    const [callStatus, setCallStatus] = useState<ICallStatus | undefined>(callType == 'offer' ? 'offline' : callType === "answer" ? 'pending' : undefined);

    const userVideRef = useRef<HTMLVideoElement>(null);
    const userStreamRef = useRef<MediaStream>();

    const remoteVideRef = useRef<HTMLVideoElement>(null);
    const remoteStreamRef = useRef<MediaStream>();

    const getUserStream = useCallback(async () => {
        if (!peer.current) peer.current = new RTCPeerConnection(RTC_Config)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callMode === "video" ? true : false });
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
                if (e.streams && remoteVideRef.current) {
                    remoteVideRef.current.srcObject = e.streams[0];
                    remoteStreamRef.current = e.streams[0]
                }
            };
        }
    }, [callMode, callOffer?.from, callReceiver, callType, socket]);

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
                setCallStatus("offline")
                socket.emit('offerCall', { callee: callReceiver, caller: Me, offer, callMode });
            } else {
                throw new Error('Failed to create offer');
            }
        } catch (error) {
            console.log('🚀 ~ createOffer ~ error:', error);
        }
    }, [Me, callMode, callReceiver, getUserStream, socket]);

    useEffect(() => {
        socket.on('onCallOffer', (offer) => {
            if (Me) {
                setCallOffer(offer);
                setMediaState(prev => { return { ...prev, cameraIsOn: offer.callMode === "video" ? true : false } })
                store.dispatch(openCallPanel({ callReceiver: Me, callType: 'answer', callMode: offer.callMode }));
            }
        });

        socket.on('onAcceptAnswer', async (payload) => {
            if (payload.acceptorSdp) {
                try {
                    await peer.current?.setRemoteDescription(new RTCSessionDescription(payload.acceptorSdp));
                    setCallStatus('accepted');
                } catch (error) {
                    console.log("🚀 ~ socket.on ~ error:", error)

                }
            }
        });
        return () => {
            socket.off("onCallOffer")
            socket.off("onAcceptAnswer")
        }
    }, [Me, socket]);

    useEffect(() => {
        const init = async () => {
            if (callType === 'offer' && isOpen) {
                setMediaState(prev => { return { ...prev, cameraIsOn: callMode === "video" ? true : false } })
                await createOffer();
            }
        };
        init();
    }, [callMode, callType, createOffer, isOpen]);

    useEffect(() => {
        if (isOpen) {
            socket.on('onIceCandidate', (candidate) => {
                if (peer.current) {
                    try {
                        peer.current.addIceCandidate(candidate);
                    } catch (error) {
                        console.log("🚀 ~ socket.on ~ error:", error)

                    }
                }
            });

            socket.on("callStatus", async (status) => {
                console.log("🚀 ~ socket.on ~ status:", status)
                if (status === "rejected") {
                    peer.current?.close()
                    peer.current = undefined
                    setCallStatus(undefined)
                    store.dispatch(closeCallPanel())
                }
                if (status === "offline" && callType === "offer") {
                    console.log("🚀 ~ socket.on ~ status:", status)
                    await wait(5000)
                    await createOffer()
                }
                setCallStatus(status)
            })

        }

        return () => {
            socket.off("onIceCandidate")
            socket.off("callStatus")
        }

    }, [callType, createOffer, isOpen, socket]);


    const hangupCall = () => {
        socket.emit("hangupCall", { to: callType === "offer" ? callReceiver : callOffer?.from })
        peer.current?.close()
        peer.current = undefined
        setCallStatus(undefined)
        store.dispatch(closeCallPanel())
    }
    const toggleCamera = () => {
        setMediaState((prev) => {
            const videoTrack = userStreamRef.current?.getTracks().find(track => track.kind === "video")
            if (prev.cameraIsOn) {
                if (videoTrack) {
                    videoTrack.enabled = false
                }
                return { ...prev, cameraIsOn: false }
            }
            else {
                if (videoTrack) {
                    videoTrack.enabled = true
                }
                return { ...prev, cameraIsOn: true }
            }
        })
    }
    const toggleMic = () => {
        setMediaState((prev) => {
            const audioTrack = userStreamRef.current?.getTracks().find(track => track.kind === "audio")
            if (prev.micIsOn) {
                if (audioTrack?.enabled) {
                    audioTrack.enabled = false
                }
                return { ...prev, micIsOn: false }
            }
            else {
                if (audioTrack) {
                    audioTrack.enabled = true
                }
                return { ...prev, micIsOn: true }
            }
        })
    }
    const toggleSpeaker = () => {
        setMediaState((prev) => {
            const remoteAudioTrack = remoteStreamRef.current?.getTracks().find(track => track.kind === "audio")

            if (prev.speakerIsOn) {
                if (remoteAudioTrack?.enabled) {
                    remoteAudioTrack.enabled = false
                }
                return { ...prev, speakerIsOn: false }
            }
            else {
                if (remoteAudioTrack) {
                    remoteAudioTrack.enabled = true
                }
                return { ...prev, speakerIsOn: true }
            }
        })
    }


    return isOpen ? (
        <>
            {callType === "offer" && callStatus !== "accepted" ? <CallAwaitingPanel to={callReceiver} callStatus={callStatus} callMode={callMode} callEndCallBack={hangupCall} /> : null}

            <CallAnswerPanel show={callType === "answer" && callStatus !== "accepted" ? true : false} callMode={callMode} caller={callOffer?.from} callAcceptCallBack={answerCall} callEndCallBack={hangupCall} /> 

            <AcceptedCall callReceiver={callType === "offer" ? callReceiver : callOffer?.from} show={callStatus === "accepted" ? true : false} mediaState={mediaState} callMode={callMode} onCameraToggle={toggleCamera} onMicToggle={toggleMic} onSpeakerToggle={toggleSpeaker} remoteVideRef={remoteVideRef} userVideoRef={userVideRef} onEndCall={hangupCall} />
        </>
    ) : null
};

export default CallPanel;
