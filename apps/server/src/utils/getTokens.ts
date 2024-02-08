import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../modules/types';
import { encryptCookie } from './encdecCookie';

// get tokens function
export const getTokens = async (user_id: string, jwt: JwtService): Promise<AuthTokens> => {
  const refresh_token = await jwt.signAsync({ user_id }, { expiresIn: '7d', secret: process.env.REFRESH_TOKEN_SECRET });
  const access_token = await jwt.signAsync({ user_id }, { expiresIn: '1d', secret: process.env.ACCESS_TOKEN_SECRET });
  const encryptedAccessToken = encryptCookie(access_token);
  const encryptedRefreshToken = encryptCookie(refresh_token);
  return { access_token: encryptedAccessToken, refresh_token: encryptedRefreshToken };
};
