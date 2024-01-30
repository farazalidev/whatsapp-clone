import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { ResponseType } from '../../Misc/ResponseType.type';
import { MessageDto } from './DTO/message.dto';
import { unreadMessage } from '../types';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserChatEntity) private UserChatRepo: Repository<UserChatEntity>,
    @InjectRepository(MessageEntity) private UserMessageRepo: Repository<MessageEntity>,
  ) {
    // get user chats service
  }

  // create a new chat
  async createAnewChat(user_id: string, chat_id: string, chat_with_id: string): Promise<ResponseType<{ chat_id: string }>> {
    try {
      const chat_for = await this.userRepo.findOne({ where: { user_id } });
      const chat_with = await this.userRepo.findOne({ where: { user_id: chat_with_id } });

      const newChat = this.UserChatRepo.create({
        id: chat_id,
        chat_for,
        chat_with,
        messages: [],
      });
      await this.UserChatRepo.save(newChat);
      return {
        success: true,
        successMessage: 'new chat created',
        data: { chat_id: newChat.id },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Error while creating a new chat', statusCode: 500 },
      };
    }
  }

  async getUserChats(user_id: string): Promise<ResponseType<UserChatEntity[]>> {
    try {
      const user = await this.UserChatRepo.find({
        where: [{ chat_for: { user_id } }, { chat_with: { user_id } }],
        relations: { messages: true },
        order: { messages: { sended_at: 'DESC' } },
      });
      if (!user) {
        return {
          success: false,
          error: { message: 'User not found', statusCode: HttpStatus.NOT_FOUND },
        };
      }

      return {
        data: user,
        success: true,
        successMessage: 'Chat Found',
      };
    } catch (error) {
      return { success: false, error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR } };
    }
  }

  // get chat by id service
  async getChatByIdService(user_id: string, chat_id: string): Promise<ResponseType<UserChatEntity>> {
    const userChat = await this.UserChatRepo.findOne({ where: { chat_for: { user_id }, id: chat_id } });

    if (!userChat) {
      return {
        success: false,
        error: { message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }

    return {
      success: true,
      successMessage: 'Chat fetched',
      data: userChat,
    };
  }

  async getChatByChatId(chat_id: string, user_id: string): Promise<ResponseType<UserChatEntity>> {
    const chat = await this.UserChatRepo.findOne({ where: [{ id: chat_id }, { chat_for: { user_id }, chat_with: { user_id } }] });

    if (!chat) {
      return {
        success: false,
        error: { message: 'Chat not Found', statusCode: 404 },
      };
    }
    return {
      success: true,
      successMessage: 'chat founded',
      data: chat,
    };
  }

  async isChatStarted(sender_id: string, receiver_id: string): Promise<ResponseType<UserChatEntity>> {
    try {
      const chat = await this.UserChatRepo.findOne({
        where: [
          { chat_for: { user_id: sender_id }, chat_with: { user_id: receiver_id } },
          { chat_for: { user_id: receiver_id }, chat_with: { user_id: sender_id } },
        ],
      });

      if (!chat) {
        return {
          success: false,
          error: { message: 'chat not found', statusCode: HttpStatus.NOT_FOUND },
        };
      }
      return {
        success: true,
        successMessage: 'chat founded',
        data: chat,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  async sendMessage(
    chat_id: string,
    sender_id: string,
    receiver_id: string,
    message: MessageDto,
  ): Promise<ResponseType<{ newMessage: MessageEntity; chat_id: string }>> {
    /**
     * In this service the user can send messages
     * There will be three possibilities
     * 1. User already have started the chat but selected from Contacts
     * 2. User does not have any chat with other user and selected from Contacts
     * 3. User have chats and selected from chats
     */

    // checking if the user have any chat with the other user
    // or the other user have any chat with user
    /**
     * This will returns true if any chat is founded
     * with in "chat_for" or "chat_with" user.
     * else false
     *
     */
    try {
      const isChatStarted = await this.UserChatRepo.findOne({
        where: [
          { chat_for: { user_id: sender_id }, chat_with: { user_id: receiver_id } },
          { chat_for: { user_id: receiver_id }, chat_with: { user_id: sender_id } },
        ],
      });

      // sender of the message
      const sender = await this.userRepo.findOne({ where: { user_id: sender_id } });
      // receiver of the message
      const receiver = await this.userRepo.findOne({ where: { user_id: receiver_id } });

      // creating a new message
      const newMessage = this.UserMessageRepo.create({
        from: sender,
        content: message.content,
      });

      /**
       * If the chat id is undefined or not provided at all
       * then new chat will be started
       */
      if (!chat_id || chat_id === 'undefined') {
        /**
         * 1
         * If the chat is already started but the user select the chat
         * from the contacts.
         * Then we will push messages into the user messages array
         */
        if (isChatStarted) {
          isChatStarted.messages.push(newMessage);
          await this.UserChatRepo.save(isChatStarted);
          return {
            success: true,
            successMessage: 'message sended',
            data: { chat_id: isChatStarted.id, newMessage },
          };
        }

        /**
         * 2
         * If the user does not have any chat with the other user
         * then a new chat will be created and message sended
         */

        const newChat = this.UserChatRepo.create({
          chat_for: sender,
          chat_with: receiver,
          messages: [newMessage],
        });

        await this.UserChatRepo.save(newChat);
        return {
          success: true,
          successMessage: 'message sended',
          data: { chat_id: newChat.id, newMessage },
        };
      }

      /**
       * 3
       * This code will run when the user provided the chat_id
       * Means that the user selected chat from the chats
       * now we are just pushing new messages in the messages array.
       */
      const chat = await this.UserChatRepo.findOne({ where: { id: chat_id } });
      chat.messages.push(newMessage);

      await this.UserChatRepo.save(chat);
      return {
        success: true,
        successMessage: 'message sended',
        data: { chat_id: chat.id, newMessage },
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }

  async getMessagesByChatId(chat_id: string): Promise<ResponseType<MessageEntity[]>> {
    try {
      const chat = await this.UserChatRepo.findOne({ where: { id: chat_id } });
      if (!chat) {
        return {
          success: false,
          error: { message: 'chat not found', statusCode: 404 },
        };
      }
      return {
        success: true,
        successMessage: 'chat founded',
        data: chat.messages,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal server error', statusCode: 500 },
      };
    }
  }
  async getUnreadMessagesForUser(user_id: string): Promise<unreadMessage[]> {
    const chats = await this.UserChatRepo.find({ where: [{ chat_for: { user_id } }, { chat_with: { user_id } }], relations: { messages: true } });

    const messages: unreadMessage[] = [];

    for (const chat of chats) {
      const unreadMessages = chat.messages.filter((message) => !message.is_seen && message.from.user_id !== user_id);

      const chatExists = messages?.find((message) => message.chat_id === chat.id);

      if (chatExists) {
        chatExists.unread_messages.push(...unreadMessages);
        return;
      }

      messages.push({ chat_id: chat.id, unread_messages: [...unreadMessages] });
    }
    return messages;
  }

  async markUnreadMessages(user_id: string, chat_id: string): Promise<ResponseType> {
    try {
      const chat = await this.UserChatRepo.findOne({ where: { id: chat_id } });

      chat.messages.forEach((message) => {
        if (!message.is_seen && message.from.user_id !== user_id) {
          message.is_seen = true;
          message.seen_at = new Date();
        }
        return;
      });

      await this.UserChatRepo.save(chat);
      return {
        success: true,
        successMessage: 'messages seen',
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'internal server error', statusCode: 500 },
      };
    }
  }

  async updateMessagesStatusToSeen(chat_id: string, user_id: string): Promise<ResponseType<{ messages: MessageEntity[]; receiver_id: string }>> {
    try {
      const chat = await this.UserChatRepo.findOne({ where: { id: chat_id } });
      const receiver_id = chat.chat_for.user_id === user_id ? chat.chat_with.user_id : chat.chat_for.user_id;

      const updatedMessages: MessageEntity[] = [];
      chat.messages.forEach((message) => {
        if (!message.is_seen && message.from.user_id !== user_id) {
          message.seen_at = new Date();
          message.is_seen = true;
          updatedMessages.push(message);
        }
      });
      await this.UserChatRepo.save(chat);
      return { success: true, successMessage: 'status updated', data: { messages: updatedMessages, receiver_id } };
    } catch (error) {
      return { success: false, error: { message: 'unable to update message status', statusCode: 500 } };
    }
  }

  async updateMessagesStatusToReceived(user_id: string): Promise<ResponseType<MessageEntity[]>> {
    try {
      const chats = await this.UserChatRepo.find({ where: [{ chat_for: { user_id } }, { chat_with: { user_id } }] });

      const updatedMessages: MessageEntity[] = [];
      for (const chat of chats) {
        chat.messages.forEach((message) => {
          if (!message.sended_at && message.from.user_id !== user_id) {
            message.sended_at = new Date();
            updatedMessages.push(message);
          }
        });
      }

      await this.UserChatRepo.save(chats);
      return {
        success: true,
        successMessage: 'status updated',
        data: updatedMessages,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'unable to update messages status', statusCode: 500 },
      };
    }
  }
}
