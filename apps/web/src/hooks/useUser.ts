import { fetcher } from '@/utils/fetcher';
import { UserChatEntity } from '@server/modules/chat/entities/userchat.entity';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import useSwr from 'swr';

const useUser = () => {
  const userFetcher = async () => {
    const Me = await fetcher<UserEntity>('user/me');
    const chats = await fetcher<UserChatEntity[]>('chat/user-chats');
    console.log(Me.profile.pic_path);

    let profile_pic;
    if (await Me.profile?.pic_path) {
      profile_pic = await fetcher<string>(`user/profile-image/${Me.profile?.pic_path}`, undefined, 'blob');
    }

    return { Me, chats, profile_pic };
  };

  return useSwr('api/user', userFetcher);
};

export default useUser;
