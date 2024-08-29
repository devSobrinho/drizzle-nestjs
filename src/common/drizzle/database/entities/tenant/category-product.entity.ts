import * as d from 'drizzle-orm/pg-core';
import { category } from './category.entity';
import { product } from './product.entity';
import { relations } from 'drizzle-orm';

// ------- CATEGORY PRODUCT TABLE *PIVOT* ---------
export const categoryProduct = d.pgTable('category_product', {
  categoryId: d
    .uuid('category_id')
    .notNull()
    .references(() => category.id),
  productId: d
    .uuid('product_id')
    .notNull()
    .references(() => product.id),
});

// RELATIONS
export const categoryProductRelations = relations(
  categoryProduct,
  ({ one }) => ({
    category: one(category, {
      fields: [categoryProduct.categoryId],
      references: [category.id],
    }),
    product: one(product, {
      fields: [categoryProduct.productId],
      references: [product.id],
    }),
  }),
);

export type CategoryProductEntity = typeof categoryProduct.$inferSelect;
export type CategoryProductEntityInsert = typeof categoryProduct.$inferInsert;
