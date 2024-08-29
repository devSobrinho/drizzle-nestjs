import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestCustom } from 'src/common/interfaces/request-custom';
import { UserEntity } from 'src/common/database/entities/main';

export interface IGetUser extends Omit<Partial<UserEntity>, 'password'> {}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IGetUser => {
    const request = ctx.switchToHttp().getRequest<RequestCustom>();
    return request.user;
  },
);
