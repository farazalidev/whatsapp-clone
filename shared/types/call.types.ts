import { UserEntity } from '../../apps/server/src/modules/user/entities/user.entity';
export interface ICallOffer {
  caller: UserEntity;
  callee: UserEntity;
  offer: RTCSessionDescriptionInit;
}

export interface IOnCallOffer {
  offer: RTCSessionDescriptionInit;
  from: UserEntity;
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
