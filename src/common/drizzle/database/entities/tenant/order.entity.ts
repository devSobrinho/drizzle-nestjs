import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { customer } from './customer.entity';
import { orderItem } from './order-item.entity';
import { payment } from './payment.entity';
import { address } from './address.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

export enum ORDER_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  BLOCKED = 'b',
  PENDING = 'p',
}

export const statusEnum = d.pgEnum('status', [
  ORDER_STATUS_ENUM.ACTIVATED,
  ORDER_STATUS_ENUM.DEACTIVATED,
  ORDER_STATUS_ENUM.BLOCKED,
  ORDER_STATUS_ENUM.PENDING,
]);

// ------- ORDER TABLE ---------
export const order = d.pgTable('order', {
  ...BaseEntityHelper.idPrimaryKey,
  orderDate: d.timestamp('order_date').notNull(),
  status: statusEnum('status').notNull(),
  totalAmount: d.decimal('total_amount').notNull(),
  number: d.varchar('number', { length: 256 }).notNull(),
  complement: d.varchar('complement', { length: 256 }),
  addressId: d.uuid('address_id').references(() => address.id),
  customerId: d
    .uuid('customer_id')
    .notNull()
    .references(() => customer.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const orderRelations = relations(order, ({ one, many }) => ({
  customer: one(customer, {
    fields: [order.customerId],
    references: [customer.id],
  }), // ONE TO MANY RELATION
  orderItem: many(orderItem), // *PIVOT CUSTOM* MANY TO ONE RELATION
  payment: one(payment), // ONE TO ONE RELATION
  address: one(address, {
    fields: [order.addressId],
    references: [address.id],
  }), // ONE TO ONE RELATION
}));
