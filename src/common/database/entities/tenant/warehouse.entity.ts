import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { inventory } from './inventory.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- WAREHOUSE TABLE ---------
export const warehouse = d.pgTable('warehouse', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }).notNull(),
  location: d.varchar('location', { length: 256 }).notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const warehouseRelations = relations(warehouse, ({ many }) => ({
  inventories: many(inventory), // MANY TO ONE RELATION
}));

export type WarehouseEntity = typeof warehouse.$inferSelect;
export type WarehouseEntityInsert = typeof warehouse.$inferInsert;
