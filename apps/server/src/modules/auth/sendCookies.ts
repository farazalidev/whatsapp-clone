import { Response } from 'express';
import { ResponseType } from 'src/Misc/ResponseType.type';
import { AuthTokens, OtpToken } from '../types';

export const sendCookies = (res: Response, tokens: AuthTokens, response: ResponseType) => {
  return res
    .cookie(process.env.REFRESH_TOKEN_NAME, tokens.refresh_token, { httpOnly: true })
    .cookie(process.env.ACCESS_TOKEN_NAME, tokens.access_token)
    .json(response);
};

export const sendOtpCookies = (res: Response, tokes: OtpToken, response: ResponseType) => {
  return res.cookie(process.env.OTP_TOKEN_NAME, tokes.otp_token, { secure: true }).send(response);
};
