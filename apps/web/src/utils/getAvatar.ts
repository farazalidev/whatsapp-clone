import { userApi } from '@/global/apis/UserApi';
import { store } from '@/global/store';

export async function getAvatar(path: string) {
  const avatar = await store.dispatch(userApi.endpoints.getProfilePic.initiate({ path }));
  if (avatar.isError) {
    return undefined;
  }
  return avatar.data;
}
