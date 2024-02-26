import { ChatsParamsDto, SortOrder } from '@server/modules/chat/DTO/chats.dto';

export const chatPaginationConfig: ChatsParamsDto = {
  messagesPage: 1,
  messagesTake: 10,
  order: SortOrder.DESC,
  page: 1,
  take: 15,
};
