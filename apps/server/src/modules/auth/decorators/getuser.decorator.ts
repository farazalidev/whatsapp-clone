import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: undefined, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req['user'];
});


