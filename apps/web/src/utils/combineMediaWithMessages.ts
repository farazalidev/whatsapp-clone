import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { extname } from 'path';
import { v4 } from 'uuid';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { omitObject } from './OmitObject';

export const combineMediaWithMessages = (files: SelectedFileType[], from: UserEntity | null, chat: UserChatEntity | undefined) => {
  const messages: MessageEntity[] = [];

  files.forEach((file) => {
    const messageId = v4();
    messages.push({
      clear_for: null,
      content: file.attachedMessage as string,
      from: from as UserEntity,
      id: messageId,
      is_seen: false,
      media: {
        id: file.id,
        ext: extname(file.file.name),
        path: `${from?.user_id}/${file.id}`,
        size: Math.trunc(file.file.size),
        thumbnail_path: file.type === 'video' ? `${file.id}` : null,
        type: file.type,
        height: file.height as number,
        width: file.width as number,
        original_name: file.original_name,
        mime: file.mime,
      },
      chat: omitObject(chat as UserChatEntity, ['messages']) as UserChatEntity,
      messageType: file.type,
      received_at: null,
      seen_at: null,
      sended: false,
      sended_at: new Date(),
    });
  });
  return messages;
};
