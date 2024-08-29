import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { categoryProduct } from './category-product.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

// ------- CATEGORY TABLE ---------
export const category = d.pgTable('category', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }).notNull(),
  description: d.varchar('description', { length: 256 }).notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATION
export const categoryRelations = relations(category, ({ many }) => ({
  categoryProducts: many(categoryProduct),
}));

export type CategoryEntity = typeof category.$inferSelect;
export type CategoryEntityInsert = typeof category.$inferInsert;
