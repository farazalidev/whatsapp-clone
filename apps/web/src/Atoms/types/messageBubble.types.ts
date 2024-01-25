import { MessageEntity } from '@server/modules/chat/entities/message.entity';

export interface IMessageBubblePreview {
  message: MessageEntity | undefined;
  isFromMe: boolean | undefined;
  messageLines?: number;
}
