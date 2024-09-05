import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { order } from './order.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- ADDRESS TABLE ---------
export const address = d.pgTable(
  'address',
  {
    ...BaseEntityHelper.idPrimaryKey,
    street: d.varchar('street', { length: 255 }).notNull(),
    city: d.varchar('city', { length: 255 }).notNull(),
    state: d.varchar('state', { length: 2 }).notNull(),
    country: d.varchar('country', { length: 255 }).notNull(),
    postalCode: d.varchar('postal_code', { length: 20 }).notNull(),
    neighborhood: d.varchar('neighborhood', { length: 255 }).notNull(),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      postalCodeIdx: d
        .uniqueIndex('address_postal_code_idx')
        .on(table.postalCode),
    };
  },
);

// RELATIONS
export const addressRelations = relations(address, ({ many }) => ({
  orders: many(order), // MANY TO ONE RELATION
}));

export type AddressEntity = typeof address.$inferSelect;
export type AddressEntityInsert = typeof address.$inferInsert;
