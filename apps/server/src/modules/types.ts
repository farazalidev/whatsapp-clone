import { MessageEntity } from './chat/entities/message.entity';

export type AuthTokens = {
  refresh_token: string;
  access_token: string;
};

export type OtpToken = {
  otp_token: string;
};

export interface unreadMessage {
  chat_id: string;
  unread_messages: MessageEntity[];
}

export interface single_unread_message {
  chat_id: string;
  message: MessageEntity;
}

export interface OtpTokenPayload {
  user_id: string;
  method: 'login' | 'registration';
}