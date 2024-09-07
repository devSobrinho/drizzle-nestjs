import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';

import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { productVariantType } from './product-variant-type.entity';

// ------- VARIANT TYPE TABLE ---------
export const variantType = d.pgTable(
  'variant_type',
  {
    ...BaseEntityHelper.idPrimaryKey,
    name: d.varchar('name', { length: 256 }).notNull(),
  },
  (table) => ({
    uniqueVariantTypeName: d
      .uniqueIndex('unique_variant_type_name')
      .on(table.name),
  }),
);

// RELATIONS
export const variantTypeRelations = relations(variantType, ({ many }) => ({
  productVariantTypes: many(productVariantType), // *PIVOT CUSTOM* MANY TO ONE RELATION
}));

export type VariantTypeEntity = typeof variantType.$inferSelect;
export type VariantTypeEntityInsert = typeof variantType.$inferInsert;
