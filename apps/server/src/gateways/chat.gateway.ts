import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  handleConnection() {
    this.server.emit('messages', this.messages);
  }
  @WebSocketServer()
  server: Server;

  private messages: string[] = ['this is dummy message'];

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    console.log(message);
    this.messages.push(message);
    this.server.emit('messages', this.messages);
  }
}
