import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { order } from './order.entity';
import { product } from './product.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- ORDER ITEM TABLE *PIVOT CUSTOM*---------
export const orderItem = d.pgTable('order_item', {
  ...BaseEntityHelper.idPrimaryKey,
  quantity: d.integer('quantity').notNull(),
  unitPrice: d.decimal('unit_price').notNull(),
  orderId: d
    .uuid('order_id')
    .notNull()
    .references(() => order.id),
  productId: d
    .uuid('product_id')
    .notNull()
    .references(() => product.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));
