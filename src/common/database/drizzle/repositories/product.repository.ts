import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as ProductSchema from '../entities/tenant/product.entity';

import { BaseRepository } from './base.repository';
import { DatabaseConfig } from '../../configs/database.config';
import { PG_CONNECTION } from 'src/common/constants/pg-connection.constant';

@Injectable()
export class ProductRepository extends BaseRepository<
  typeof ProductSchema,
  typeof ProductSchema.product,
  ProductSchema.ProductEntity,
  ProductSchema.ProductEntityInsert
> {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<typeof ProductSchema>,
    protected readonly dbConfig: DatabaseConfig,
  ) {
    super(db, ProductSchema.product, dbConfig);
  }
}
