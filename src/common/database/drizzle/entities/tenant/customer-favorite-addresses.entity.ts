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
    name: d.varchar('name', { length: 255 }).notNull(),
    default: d.boolean('default').notNull(),
    number: d.varchar('number', { length: 255 }).notNull(),
    complement: d.varchar('complement', { length: 255 }),
    addressId: d.uuid('address_id').references(() => address.id),
    customerId: d.uuid('customer_id').references(() => customer.id),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      nameIdx: d
        .uniqueIndex('customer_favorite_addresses_name_idx')
        .on(table.name),
    };
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
