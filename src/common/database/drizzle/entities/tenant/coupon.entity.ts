import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { order } from './order.entity';

export enum COUPON_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  BLOCKED = 'b',
}

export const couponStatusEnum = d.pgEnum('status', [
  COUPON_STATUS_ENUM.ACTIVATED,
  COUPON_STATUS_ENUM.DEACTIVATED,
  COUPON_STATUS_ENUM.BLOCKED,
]);

// ------- COUPON TABLE ---------
export const coupon = d.pgTable(
  'coupon',
  {
    ...BaseEntityHelper.idPrimaryKey,
    code: d.varchar('code', { length: 50 }).notNull(),
    description: d.varchar('description', { length: 255 }).notNull(),
    discountType: d.varchar('discount_type', { length: 10 }).notNull(),
    discountValue: d
      .decimal('discount_value', { precision: 10, scale: 2 })
      .notNull(),
    maxUsage: d.integer('max_usage').notNull().default(1),
    usageCount: d.integer('usage_count').notNull().default(0),
    dateStart: d.timestamp('date_start').notNull(),
    dateEnd: d.timestamp('date_end').notNull(),
    status: couponStatusEnum('status')
      .notNull()
      .default(COUPON_STATUS_ENUM.ACTIVATED),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      codeIdx: d.uniqueIndex('coupon_code_idx').on(table.code),
    };
  },
);

// RELATIONS
export const couponRelations = relations(coupon, ({ many }) => ({
  orders: many(order), // MANY TO ONE RELATION
}));

export type CouponEntity = typeof coupon.$inferSelect;
export type CouponEntityInsert = typeof coupon.$inferInsert;
