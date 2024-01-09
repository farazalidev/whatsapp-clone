import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../modules/types';

// get tokens function
export const getTokens = async (user_id: string, jwt: JwtService): Promise<AuthTokens> => {
  const refresh_token = await jwt.signAsync({ user_id }, { expiresIn: '7d', secret: process.env.REFRESH_TOKEN_SECRET });
  const access_token = await jwt.signAsync({ user_id }, { expiresIn: '1d', secret: process.env.ACCESS_TOKEN_SECRET });
  return { access_token, refresh_token };
};
