import { JwtService } from '@nestjs/jwt';

export async function isValidToken<TPayload = any>(
  token: string,
  secret: string,
  jwt: JwtService,
): Promise<{ success: boolean; payload: TPayload }> {
  try {
    const data = (await jwt.verifyAsync(token, { secret })) as TPayload;
    return { payload: data, success: true };
  } catch (error) {
    return { payload: null, success: false };
  }
}
