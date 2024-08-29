import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { order } from './order.entity';
import { customerFavoriteAddresses } from './customer-favorite-addresses.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- CUSTOMER TABLE ---------
export const customer = d.pgTable('customer', {
  ...BaseEntityHelper.idPrimaryKey,
  firstName: d.varchar('first_name', { length: 256 }).notNull(),
  lastName: d.varchar('last_name', { length: 256 }).notNull(),
  email: d.varchar('email', { length: 256 }).notNull(),
  phone: d.varchar('phone', { length: 256 }).notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const customerOrdersRelations = relations(customer, ({ many, one }) => ({
  orders: many(order), // MANY TO ONE RELATION
  customerFavoriteAddresses: many(customerFavoriteAddresses), // MANY TO ONE RELATION
}));
