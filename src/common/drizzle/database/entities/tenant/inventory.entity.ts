import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { product } from './product.entity';
import { warehouse } from './warehouse.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- INVENTORY TABLE ---------
export const inventory = d.pgTable('inventory', {
  ...BaseEntityHelper.idPrimaryKey,
  stockQuantity: d.integer('stock_quantity').notNull(),
  productId: d
    .uuid('product_id')
    .notNull()
    .references(() => product.id),
  warehouseId: d.uuid('warehouse_id').references(() => warehouse.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(product, {
    fields: [inventory.productId],
    references: [product.id],
  }), // ONE TO ONE RELATION
  warehouse: one(warehouse, {
    fields: [inventory.warehouseId],
    references: [warehouse.id],
  }), // ONE TO MANY RELATION
}));
