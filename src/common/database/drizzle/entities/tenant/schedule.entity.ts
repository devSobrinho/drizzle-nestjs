import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { orderItem } from './order-item.entity';
import { executor } from './executor.entity';

// ------- SCHEDULE TABLE---------
export const schedule = d.pgTable('schedule', {
  ...BaseEntityHelper.idPrimaryKey,
  startTime: d.timestamp('start_time').notNull(),
  endTime: d.timestamp('end_time').notNull(),
  isCheckedIn: d.boolean('is_checked_in').notNull().default(false),
  orderItemId: d.uuid('order_item_id').references(() => orderItem.id),
  executorId: d.uuid('executor_id').references(() => executor.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const scheduleRelations = relations(schedule, ({ one }) => ({
  orderItem: one(orderItem, {
    fields: [schedule.orderItemId],
    references: [orderItem.id],
  }), // ONE TO MANY RELATION
  executor: one(executor, {
    fields: [schedule.executorId],
    references: [executor.id],
  }), // ONE TO MANY RELATION
}));

export type ScheduleEntity = typeof schedule.$inferSelect;
export type ScheduleEntityInsert = typeof schedule.$inferInsert;
