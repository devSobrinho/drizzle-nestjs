import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as CustomerSchema from '../entities/tenant/customer.entity';

import { BaseRepository } from './base.repository';
import { PG_CONNECTION } from '../pg-connection';
import { DatabaseConfig } from '../configs/database.config';

@Injectable()
export class CustomerRepository extends BaseRepository<
  typeof CustomerSchema,
  typeof CustomerSchema.customer,
  CustomerSchema.CustomerEntity,
  CustomerSchema.CustomerEntityInsert
> {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<typeof CustomerSchema>,
    protected readonly dbConfig: DatabaseConfig,
  ) {
    super(db, CustomerSchema.customer, dbConfig);
  }
}
