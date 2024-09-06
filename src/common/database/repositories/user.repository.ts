import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as UserSchema from '../entities/main/user.entity';

import { BaseRepository } from './base.repository';
import { DatabaseConfig } from '../configs/database.config';
import { eq } from 'drizzle-orm';
import { PG_CONNECTION } from 'src/common/constants/pg-connection.constant';

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

  seuDb = this.db;

  async getUserByEmailVerified(email: string): Promise<UserSchema.UserEntity> {
    const result = await this.db.query.user.findFirst({
      where: eq(UserSchema.user.email, email),
      with: { tenant: true, customer: true, executor: true, userRoles: true },
    });
    if (!result) throw new NotFoundException('Usuário não encontrado');

    return result as UserSchema.UserEntity;
  }
}
