import { Injectable, Scope } from '@nestjs/common';
import { IGetUser } from 'src/common/decorators/api/get-user.decorator';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private user: IGetUser | null = null;

  setUser(user?: IGetUser) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
