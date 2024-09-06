import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import * as cacheManager from 'cache-manager';
import { CACHE_MANAGER } from 'src/common/constants/cache.constant';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_MANAGER,
      useFactory: () => {
        return cacheManager.caching('memory', { ttl: 1000 * 60 });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
