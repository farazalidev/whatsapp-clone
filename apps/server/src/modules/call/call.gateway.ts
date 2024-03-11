import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthMiddleware } from '../auth/guards/socketio.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { onEvent } from '../../utils/onEvent';
import { IAcceptAnswerPayload, ICallOffer, ISocket, IceCandidatePayload } from '@shared/types';
import { OnlineUsersService } from '../../services/onlineUsers.service';
import { IRejectCallPayload } from '../../../../../shared/types/call.types';

@WebSocketGateway({ cors: { credentials: true, origin: [process.env.FRONT_END_URL] } })
export class CallGateway implements OnGatewayInit {
  constructor(
    private onlineUsersService: OnlineUsersService,
    @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>,
  ) {}

  afterInit(server: Server) {
    server.use(WsAuthMiddleware(this.UserRepo));
  }

  @onEvent('offerCall')
  offerCall(client: ISocket, payload: ICallOffer) {
    this.onlineUsersService.getUserPid(payload.callee.user_id, (error, pid) => {
      if (error) {
        client.emit('callStatus', 'error');
        return;
      }
      // if the user is online the send the call notification
      if (pid) {
        client.emit('callStatus', 'online');
        client.to(payload.callee.user_id).emit('onCallOffer', { from: payload.caller, offer: payload.offer, callMode: payload.callMode });
      } else {
        client.emit('callStatus', 'offline');
      }
    });
  }

  @onEvent('acceptAnswer')
  acceptAnswer(client: ISocket, payload: IAcceptAnswerPayload) {
    client.to(payload.to.user_id).emit('onAcceptAnswer', { callee: client.user, acceptorSdp: payload.ans });
  }

  @onEvent('icecandidate')
  icecandidate(client: ISocket, payload: IceCandidatePayload) {
    client.to(payload.to.user_id).emit('onIceCandidate', payload.candidate);
  }

  @onEvent('hangupCall')
  rejectCall(client: ISocket, payload: IRejectCallPayload) {
    client.to(payload.to.user_id).emit('callStatus', 'rejected');
  }
}
