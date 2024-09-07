import * as d from 'drizzle-orm/pg-core';

import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { product } from './product.entity';
import { relations } from 'drizzle-orm';
import { productVariantType } from './product-variant-type.entity';
import { inventory } from './inventory.entity';

export enum PRODUCT_VARIANT_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
}

export const productVariantStatusEnum = d.pgEnum('status', [
  PRODUCT_VARIANT_STATUS_ENUM.ACTIVATED,
  PRODUCT_VARIANT_STATUS_ENUM.DEACTIVATED,
]);

// ------- PRODUCT VARIANT TABLE ---------
export const productVariant = d.pgTable(
  'product_variant',
  {
    ...BaseEntityHelper.idPrimaryKey,
    price: d.decimal('price').notNull(),
    quantity: d.integer('quantity').notNull().default(0),
    barcode: d.varchar('barcode', { length: 256 }).notNull(),
    status: productVariantStatusEnum('status')
      .notNull()
      .default(PRODUCT_VARIANT_STATUS_ENUM.ACTIVATED),
    productId: d
      .uuid('product_id')
      .notNull()
      .references(() => product.id),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      uniqueProductVariantBarcodeIdx: d
        .uniqueIndex('unique_product_variant_barcode_idx')
        .on(table.productId, table.barcode),
    };
  },
);

// RELATIONS
export const productVariantRelations = relations(
  productVariant,
  ({ many, one }) => ({
    product: one(product, {
      fields: [productVariant.productId],
      references: [product.id],
    }), // ONE TO MANY RELATION
    productVariantTypes: many(productVariantType), // *PIVOT CUSTOM* MANY TO ONE RELATION
    inventory: many(inventory), // MANY TO ONE RELATION
  }),
);

export type ProductVariantEntity = typeof productVariant.$inferSelect;
export type ProductVariantEntityInsert = typeof productVariant.$inferInsert;
