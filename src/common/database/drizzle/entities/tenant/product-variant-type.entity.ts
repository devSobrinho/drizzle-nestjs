import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';

import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { productVariant } from './product-variant.entity';
import { variantType } from './variant-type.entity';

// ------- PRODUCT VARIANT TYPE TABLE ---------
export const productVariantType = d.pgTable(
  'product_variant_type',
  {
    ...BaseEntityHelper.idPrimaryKey,
    variantValue: d.varchar('variant_value', { length: 256 }).notNull(),
    productVariantId: d
      .uuid('product_variant_id')
      .notNull()
      .references(() => productVariant.id),
    variantTypeId: d
      .uuid('variant_type_id')
      .notNull()
      .references(() => variantType.id),
  },
  (table) => ({
    uniqueProductVariantTypeIdx: d
      .uniqueIndex('unique_product_variant_type_value_idx')
      .on(table.productVariantId, table.variantTypeId, table.variantValue),
  }),
);

// RELATIONS
export const productVariantTypeRelations = relations(
  productVariantType,
  ({ one }) => ({
    productVariant: one(productVariant, {
      fields: [productVariantType.productVariantId],
      references: [productVariant.id],
    }), // ONE TO MANY RELATION
    variantType: one(variantType, {
      fields: [productVariantType.variantTypeId],
      references: [variantType.id],
    }), // ONE TO MANY RELATION
  }),
);

export type ProductVariantTypeEntity = typeof productVariantType.$inferSelect;
export type ProductVariantTypeEntityInsert =
  typeof productVariantType.$inferInsert;
