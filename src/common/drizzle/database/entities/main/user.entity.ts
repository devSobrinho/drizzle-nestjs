import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { tenant } from './tenant.entity';
import { customer } from '../tenant';
import { userRoles } from './user-roles.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

const schemaMain = d.pgSchema('main');

// ------- USER TABLE ---------
export enum USER_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
  BLOCKED = 'b',
  PENDING = 'p',
}

export const userStatusEnum = schemaMain.enum('status', [
  USER_STATUS_ENUM.ACTIVATED,
  USER_STATUS_ENUM.DEACTIVATED,
  USER_STATUS_ENUM.BLOCKED,
  USER_STATUS_ENUM.PENDING,
]);

export const user = schemaMain.table('user', {
  ...BaseEntityHelper.idPrimaryKey,
  email: d.varchar('email').notNull().unique(),
  password: d.varchar('password').notNull(),
  status: userStatusEnum('status').notNull(),
  tenantId: d.uuid('tenant_id').references(() => tenant.id),
});

export const userRelations = relations(user, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [user.id],
    references: [tenant.id],
  }), // ONE TO MANY RELATION
  userRoles: many(userRoles), // *PIVOT TABLE*
  customer: one(customer), // ONE TO ONE RELATION
}));

export type UserEntity = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
