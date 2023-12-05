import { Exclude, Expose } from 'class-transformer';
import { UserProfileEntity } from '../entities/userprofile.entity';
import { UserChatEntity } from 'src/modules/chat/entities/userchat.entity';
import { ChatRequestEntity } from '../entities/chatRequest.entity';

@Exclude()
export class UserOccasionalDto {
  @Expose()
  user_id: string;

  @Expose()
  username: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose({ groups: ['with_password'] })
  password: string;

  @Expose({ groups: ['with_profile'] })
  profile: UserProfileEntity;

  @Expose({ groups: ['with_chats'] })
  chats: UserChatEntity[];

  @Expose({ groups: ['with_chat_requests'] })
  chats_requests: ChatRequestEntity[];

  @Expose({ groups: ['with_isVerified'] })
  isVerified: boolean = false;

  @Expose({ groups: ['with_is_profile_completed'] })
  is_profile_completed: boolean = false;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
