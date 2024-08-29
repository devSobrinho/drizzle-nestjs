import { Request } from 'express';
import { IGetUser } from '../decorators/api/get-user.decorator';

export interface RequestCustom extends Request {
  user: IGetUser;
}
