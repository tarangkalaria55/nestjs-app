import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICurrentUser } from 'src/jwt/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user: ICurrentUser | undefined = req.user;
    return user;
  },
);
