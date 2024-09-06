import { Inject, Injectable } from '@nestjs/common';
import { PG_CONNECTION } from './pg-connection';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { EntitiesSchema } from './entities/entities.schema';
import { DatabaseConfig } from './configs/database.config';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<typeof EntitiesSchema>,
    protected readonly dbConfig: DatabaseConfig,
  ) {}

  execute<T>(
    callback: (db: PostgresJsDatabase<typeof EntitiesSchema>) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (db) => callback(db));
  }
}
