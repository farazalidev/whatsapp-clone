import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserChatEntity } from './entities/userchat.entity';
import { MessageEntity } from './entities/message.entity';
import { ResponseType } from '../../Misc/ResponseType.type';
import { MessageDto } from './DTO/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(UserChatEntity) private UserChatRepo: Repository<UserChatEntity>,
    @InjectRepository(MessageEntity) private UserMessageRepo: Repository<MessageEntity>,
  ) {
    // get user chats service
  }
  async getUserChats(user_id: string): Promise<ResponseType<UserChatEntity[]>> {
    try {
      const user = await this.UserChatRepo.find({
        where: [{ chat_for: { user_id } }, { chat_with: { user_id } }],
        relations: { messages: { from: true } },
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

  // send message
  async sendMessageService(sender_id: string, receiver_id: string, message: MessageDto): Promise<ResponseType> {
    /**
     * finding if the user chat is already started then
     * sending message in the chat
     */

    const sender = await this.userRepo.findOne({ where: { user_id: sender_id } });
    const receiver = await this.userRepo.findOne({ where: { user_id: receiver_id } });

    if (!sender || !receiver) {
      return {
        success: false,
        error: { message: 'Internal server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }

    const chatIsInit = await this.UserChatRepo.findOne({
      where: { chat_for: { user_id: sender_id }, chat_with: { user_id: receiver_id } },
    });
    if (chatIsInit) {
      const newMessage = new MessageEntity();
      newMessage.content = message.content;
      newMessage.from = sender;

      chatIsInit.messages.push(newMessage);
      await this.UserChatRepo.save(chatIsInit);
      return {
        success: true,
        successMessage: 'message sended',
      };
    }

    /**
     * if the chat is not init then
     * initializing a new chat and then sending message
     */

    const newChat = this.UserChatRepo.create({
      chat_for: sender,
      chat_with: receiver,
      messages: [{ content: message.content, from: sender }],
    });

    await this.UserChatRepo.save(newChat);

    return {
      success: true,
      successMessage: 'chat started and message sended',
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

  async sendMessage(chat_id: string, sender_id: string, receiver_id: string, message: MessageDto): Promise<ResponseType> {
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
            data: isChatStarted.id,
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
          data: newChat.id,
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
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Internal Server Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR },
      };
    }
  }
}
