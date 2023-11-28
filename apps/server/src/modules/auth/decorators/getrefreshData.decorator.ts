import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetRefreshData = createParamDecorator((data: undefined, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const refresh = req['refresh'];
  const refresh_user = req['refresh_user'];
  return { refresh, refresh_user };
});
