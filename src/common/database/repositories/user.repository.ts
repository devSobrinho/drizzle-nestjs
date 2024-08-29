import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as UserSchema from '../entities/main/user.entity';

import { BaseRepository } from './base.repository';
import { PG_CONNECTION } from '../pg-connection';
import { DatabaseConfig } from '../configs/database.config';

@Injectable()
export class UserRepository extends BaseRepository<
  typeof UserSchema,
  typeof UserSchema.user,
  UserSchema.UserEntity,
  UserSchema.UserEntityInsert
> {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<typeof UserSchema>,
    protected readonly dbConfig: DatabaseConfig,
  ) {
    super(db, UserSchema.user, dbConfig);
  }
}
