import { IsEnum, Min } from 'class-validator';
import { UserChatEntity } from '../entities/userchat.entity';
import { MessageEntity } from '../entities/message.entity';

export interface ChatsExtendedWithCount extends UserChatEntity {
  count: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalMessagesPages: number;
  messagesTake: number;
}

export class ChatsDto {
  data: ChatsExtendedWithCount[];
  meta: ChatsDtoMeta;
}

export class ChatsDtoMeta {
  totalChats: number;
  currentPage: number;
  totalPages: number;
  take: number;
  messagesTake: number;
  hasNext: boolean;
  hasPrevious: boolean;

  constructor({ take, messagesTake, page, totalChats }: ChatsParamsDto & { totalChats: number }) {
    this.currentPage = page;
    this.totalChats - this.totalChats;
    this.take = take;
    this.totalPages = Math.ceil(totalChats / take);
    this.messagesTake = messagesTake;
    this.hasNext = this.currentPage < this.totalPages;
    this.hasPrevious = this.currentPage > 1;
  }
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ChatsParamsDto {
  @Min(1)
  page: number;

  @Min(1)
  take: number;

  @Min(1)
  messagesTake: number;

  @Min(1)
  messagesPage: number;

  @IsEnum(SortOrder)
  order: SortOrder;
}

export class PaginatedMessagesMeta {
  currentPage: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;

  take: number;

  totalMessages: number;

  constructor({ totalMessages, messagesPage, messagesTake }: { totalMessages: number } & PaginatedMessagesParamsDto) {
    this.currentPage = messagesPage;
    this.totalMessages = totalMessages;
    this.totalPages = Math.ceil(totalMessages / messagesTake);
    this.hasNext = this.currentPage < this.totalPages;
    this.hasPrevious = this.currentPage > 1;
    this.take = messagesTake;
  }
}

export type PaginatedMessages = {
  messages: MessageEntity[];
  meta: PaginatedMessagesMeta;
};

export class PaginatedMessagesParamsDto {
  @Min(1)
  messagesTake: number;

  @Min(1)
  messagesPage: number;

  @IsEnum(SortOrder)
  order: SortOrder;
}
