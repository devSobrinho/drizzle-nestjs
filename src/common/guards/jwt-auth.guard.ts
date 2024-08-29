import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PublicRouterKey } from '../decorators/api/public-router.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const publicRouter = this.reflector.getAllAndOverride<boolean>(
      PublicRouterKey,
      [context.getHandler(), context.getClass],
    );

    if (publicRouter) return true;

    const canActive = super.canActivate(context);
    if (typeof canActive === 'boolean') return canActive;

    const canActivePromise = canActive as Promise<boolean>;
    return canActivePromise.catch((e) => {
      if (e instanceof UnauthorizedException)
        throw new UnauthorizedException(e.message);

      throw new UnauthorizedException();
    });
  }
}
