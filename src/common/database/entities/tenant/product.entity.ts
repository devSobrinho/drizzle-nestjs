import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { categoryProduct } from './category-product.entity';
import { orderItem } from './order-item.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { productVariant } from './product-variant.entity';

export enum PRODUCT_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  PENDING = 'p',
  BLOCKED = 'b',
}

export const productStatusEnum = d.pgEnum('status', [
  PRODUCT_STATUS_ENUM.ACTIVATED,
  PRODUCT_STATUS_ENUM.DEACTIVATED,
  PRODUCT_STATUS_ENUM.PENDING,
]);

export enum PRODUCT_TYPE_ENUM {
  STOCK = 'stock',
  CONSUMABLE = 'consumable',
}

export const productTypeEnum = d.pgEnum('type', [
  PRODUCT_TYPE_ENUM.STOCK,
  PRODUCT_TYPE_ENUM.CONSUMABLE,
]);

// ------- PRODUCT TABLE ---------
export const product = d.pgTable('product', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }).notNull(),
  description: d.varchar('description', { length: 256 }).notNull(),
  basePrice: d.decimal('base_price').notNull(),
  status: productStatusEnum('status').notNull(),
  type: productTypeEnum('type').notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const productRelations = relations(product, ({ many }) => ({
  categoryProducts: many(categoryProduct), // *PIVOT TABLE*
  orderItem: many(orderItem), // *PIVOT CUSTOM* MANY TO ONE RELATION
  variants: many(productVariant), // MANY TO ONE RELATION
}));

export type ProductEntity = typeof product.$inferSelect;
export type ProductEntityInsert = typeof product.$inferInsert;
