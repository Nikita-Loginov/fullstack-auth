import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'generated/prisma/client';

export const UserCurrent = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
