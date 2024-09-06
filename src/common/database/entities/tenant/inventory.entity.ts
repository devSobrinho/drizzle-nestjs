import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { warehouse } from './warehouse.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { productVariant } from './product-variant.entity';

// ------- INVENTORY TABLE ---------
export const inventory = d.pgTable(
  'inventory',
  {
    ...BaseEntityHelper.idPrimaryKey,
    name: d.varchar('name', { length: 255 }).notNull(),
    quantity: d.integer('quantity').notNull(),
    productVariantId: d
      .uuid('product_variant_id')
      .notNull()
      .references(() => productVariant.id),
    warehouseId: d.uuid('warehouse_id').references(() => warehouse.id),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      inventory_name_idx: d.index('inventory_name_idx').on(table.name),
    };
  },
);

// RELATIONS
export const inventoryRelations = relations(inventory, ({ one }) => ({
  productVariant: one(productVariant, {
    fields: [inventory.productVariantId],
    references: [productVariant.id],
  }), // ONE TO MANY RELATION
  warehouse: one(warehouse, {
    fields: [inventory.warehouseId],
    references: [warehouse.id],
  }), // ONE TO MANY RELATION
}));

export type InventoryEntity = typeof inventory.$inferSelect;
export type InventoryEntityInsert = typeof inventory.$inferInsert;
