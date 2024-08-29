import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { order } from './order.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

export enum PAYMENT_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  BLOCKED = 'b',
  PENDING = 'p',
}

export const paymentStatusEnum = d.pgEnum('status', [
  PAYMENT_STATUS_ENUM.ACTIVATED,
  PAYMENT_STATUS_ENUM.DEACTIVATED,
  PAYMENT_STATUS_ENUM.BLOCKED,
  PAYMENT_STATUS_ENUM.PENDING,
]);

export enum PAYMENT_METHOD_ENUM {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
}

export const paymentMethodEnum = d.pgEnum('payment_method', [
  PAYMENT_STATUS_ENUM.ACTIVATED,
  PAYMENT_STATUS_ENUM.DEACTIVATED,
  PAYMENT_STATUS_ENUM.BLOCKED,
  PAYMENT_STATUS_ENUM.PENDING,
]);

// ------- PAYMENT TABLE ---------
export const payment = d.pgTable('payment', {
  ...BaseEntityHelper.idPrimaryKey,
  paymentDate: d.timestamp('payment_date').notNull(),
  amount: d.decimal('amount').notNull(),
  status: paymentStatusEnum('status').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  orderId: d
    .uuid('order_id')
    .notNull()
    .references(() => order.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const paymentRelations = relations(payment, ({ one }) => ({
  order: one(order, {
    fields: [payment.orderId],
    references: [order.id],
  }), // ONE TO ONE RELATION
}));
