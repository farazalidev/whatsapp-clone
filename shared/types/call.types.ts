import { UserEntity } from '../../apps/server/src/modules/user/entities/user.entity';
export interface ICallOffer {
  caller: UserEntity;
  callee: UserEntity;
  offer: RTCSessionDescriptionInit;
  callMode: CallMode;
}

export interface IOnCallOffer {
  offer: RTCSessionDescriptionInit;
  from: UserEntity;
  callMode: CallMode;
}

export interface IAcceptAnswerPayload {
  to: UserEntity;
  ans: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  to: UserEntity;
  candidate: RTCIceCandidate;
}

export interface OnAcceptAnswer {
  callee: UserEntity;
  acceptorSdp: RTCSessionDescriptionInit;
}

export interface IRejectCallPayload {
  to: UserEntity | undefined;
}

export type ICallStatus = 'offline' | 'online' | 'rejected' | 'error' | 'pending' | 'accepted';
export type CallMode = 'video' | 'voice' | undefined;
