import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetOtpPayload = createParamDecorator((data: undefined, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req['otp'];
});
