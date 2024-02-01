import { SelectedFileType } from '@/components/User/chat/chatpanel/SelectedFiles';
import { MessageEntity } from '@server/modules/chat/entities/message.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import { extname } from 'path';
import { v4 } from 'uuid';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { splitFileIntoChunks } from './splitFileIntoChunks';

export const combineMediaWithMessages = (files: SelectedFileType[], from: UserEntity | null, chat: UserChatEntity | undefined) => {
  const messages: MessageEntity[] = [];

  files.forEach((file) => {
    const { totalChunks } = splitFileIntoChunks(file.file);
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
        path: file.id,
        size: file.file.size,
        thumbnail_path: file.type === 'video' ? `${file.id}` : null,
        type: file.type,
        chunksUploaded: 0,
        totalChunks,
        message: messageId,
        height: file.height,
        width: file.width,
        original_name: file.original_name,
      },
      chat: chat as UserChatEntity,
      messageType: file.type,
      received_at: null,
      seen_at: null,
      sended: false,
      sended_at: new Date(),
    });
  });
  return messages;
};
