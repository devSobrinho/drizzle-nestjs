import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestCustom } from 'src/common/interfaces/request-custom';

// TODO: IMPLEMENTAR INTERFACE DO USER
export interface IGetUser extends Omit<Partial<any>, 'password'> {}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IGetUser => {
    const request = ctx.switchToHttp().getRequest<RequestCustom>();
    return request.user;
  },
);
