import { Response } from 'express';
import { AuthTokens, OtpToken } from '../types';
import { ResponseType } from '../../Misc/ResponseType.type';

export const sendCookies = (res: Response, tokens: AuthTokens, response: ResponseType) => {
  return res
    .cookie(process.env.REFRESH_TOKEN_NAME, tokens.refresh_token, { httpOnly: true, sameSite: 'none', secure: true })
    .cookie(process.env.ACCESS_TOKEN_NAME, tokens.access_token)
    .json(response);
};

export const sendOtpCookies = (res: Response, tokes: OtpToken, response: ResponseType) => {
  return res.cookie(process.env.OTP_TOKEN_NAME, tokes.otp_token, { secure: true }).send(response);
};
