import { sql } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';

export class BaseEntityHelper {
  static idPrimaryKey = {
    id: d.uuid('id').primaryKey().default(sql.raw(`gen_random_uuid()`)),
  };

  static timestampColumns = {
    createdAt: d.timestamp('created_at').notNull().default(sql.raw('now()')),
    updatedAt: d.timestamp('updated_at').notNull().default(sql.raw('now()')),
  };
}
