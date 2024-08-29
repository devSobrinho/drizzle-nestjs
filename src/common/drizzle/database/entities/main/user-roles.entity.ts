import * as d from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { role } from './role.entity';
import { user } from './user.entity';

const schemaMain = d.pgSchema('main');

// ------- USER ROLES TABLE ---------
export const userRoles = schemaMain.table('user_roles', {
  userId: d.uuid('user_id').references(() => user.id),
  roleId: d.uuid('role_id').references(() => role.id),
});

// RELATIONS
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(role, {
    fields: [userRoles.roleId],
    references: [role.id],
  }),
  user: one(user, {
    fields: [userRoles.userId],
    references: [user.id],
  }),
}));
