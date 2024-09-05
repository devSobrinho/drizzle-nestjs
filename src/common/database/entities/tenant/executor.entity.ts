import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';
import { user } from '../main';
import { schedule } from './schedule.entity';

// ------- EXECUTOR TABLE---------
export const executor = d.pgTable('executor', {
  ...BaseEntityHelper.idPrimaryKey,
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const executorRelations = relations(executor, ({ one, many }) => ({
  user: one(user, {
    fields: [executor.id],
    references: [user.executorId],
  }), // ONE TO ONE RELATION
  schedules: many(schedule), // MANY TO ONE RELATION
}));

export type ExecutorEntity = typeof executor.$inferSelect;
export type ExecutorEntityInsert = typeof executor.$inferInsert;
