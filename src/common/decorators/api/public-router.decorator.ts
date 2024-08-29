import { SetMetadata } from '@nestjs/common';

export const PublicRouterKey = 'publicRouter';
export const PublicRouter = () => SetMetadata(PublicRouterKey, true);
