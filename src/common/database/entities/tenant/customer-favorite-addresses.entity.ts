import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { address } from './address.entity';
import { customer } from './customer.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- CUSTOMER FAVORITE ADDRESSES TABLE ---------
export const customerFavoriteAddresses = d.pgTable(
  'customer_favorite_addresses',
  {
    ...BaseEntityHelper.idPrimaryKey,
    default: d.boolean('default').notNull(),
    number: d.varchar('number', { length: 256 }).notNull(),
    complement: d.varchar('complement', { length: 256 }),
    addressId: d.uuid('address_id').references(() => address.id),
    customerId: d.uuid('customer_id').references(() => customer.id),
    ...BaseEntityHelper.timestampColumns,
  },
);

// RELATIONS
export const customerFavoriteAddressesRelations = relations(
  customerFavoriteAddresses,
  ({ one }) => ({
    customer: one(customer), // ONE TO MANY RELATION
  }),
);

export type CustomerFavoriteAddressesEntity =
  typeof customerFavoriteAddresses.$inferSelect;
export type CustomerFavoriteAddressesEntityInsert =
  typeof customerFavoriteAddresses.$inferInsert;
