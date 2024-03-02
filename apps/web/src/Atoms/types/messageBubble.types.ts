import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { IMessageBubble } from '../chat/messageBubbles/MessageBubble';

export interface IMessageBubblePreview extends IMessageBubble {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
}
