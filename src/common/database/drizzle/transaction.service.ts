import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { EntitiesSchema } from './entities/entities.schema';
import { DatabaseConfig } from '../configs/database.config';
import { PG_CONNECTION } from '../../constants/pg-connection.constant';

@Injectable()
export class TransactionDrizzleService {
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
