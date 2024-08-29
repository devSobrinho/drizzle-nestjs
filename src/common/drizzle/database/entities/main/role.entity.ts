import { relations } from 'drizzle-orm';
import * as d from 'drizzle-orm/pg-core';
import { tenant } from './tenant.entity';
import { permission } from './permission.entity';
import { userRoles } from './user-roles.entity';
import { rolePermissions } from './role-permissions.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

const schemaMain = d.pgSchema('main');

// ------- ROLE TABLE ---------
export enum ROLE_STATUS_ENUM {
  ACTIVATED = 'a',
  DEACTIVATED = 'd',
}

export const roleStatusEnum = schemaMain.enum('status', [
  ROLE_STATUS_ENUM.ACTIVATED,
  ROLE_STATUS_ENUM.DEACTIVATED,
]);

export const role = schemaMain.table('role', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name').notNull(),
  description: d.varchar('description'),
  status: roleStatusEnum('status').notNull(),
  tenantId: d.integer('tenant_id').references(() => tenant.id),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const roleRelations = relations(role, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [role.tenantId],
    references: [tenant.id],
  }), // ONE TO MANY RELATION
  permissions: many(permission), // MANY TO MANY RELATION
  userRoles: many(userRoles), // *PIVOT TABLE*
  rolePermissions: many(rolePermissions), // *PIVOT TABLE*
}));

export type RoleEntity = typeof role.$inferSelect;
export type RoleEntityInsert = typeof role.$inferInsert;
