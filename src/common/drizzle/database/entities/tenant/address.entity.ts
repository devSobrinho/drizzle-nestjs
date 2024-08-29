import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { order } from './order.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- ADDRESS TABLE ---------
export const address = d.pgTable('address', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }).notNull(),
  description: d.varchar('description', { length: 256 }).notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const addressRelations = relations(address, ({ many }) => ({
  orders: many(order), // MANY TO ONE RELATION
}));
