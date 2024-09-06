import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from 'src/common/constants/cache.constant';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string) {
    return this.cacheManager.get<string>(key);
  }

  async set(key: string, value: any, expiresIn?: number) {
    return this.cacheManager.set(key, value, expiresIn);
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }
}
