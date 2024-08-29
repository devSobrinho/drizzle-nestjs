import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../modules/request-context/request-context.service';
import { IGetUser } from '../decorators/api/get-user.decorator';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as IGetUser;
    this.requestContextService.setUser(user);
    next();
  }
}
