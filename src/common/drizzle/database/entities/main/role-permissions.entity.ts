import * as d from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { role } from './role.entity';
import { permission } from './permission.entity';

const schemaMain = d.pgSchema('main');

// ------- ROLE PERMISSIONS TABLE ---------
export const rolePermissions = schemaMain.table('role_permissions', {
  roleId: d.uuid('role_id').references(() => role.id),
  permissionId: d.uuid('permission_id').references(() => permission.id),
});

// RELATIONS
export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(role, {
      fields: [rolePermissions.roleId],
      references: [role.id],
    }),
    permission: one(permission, {
      fields: [rolePermissions.permissionId],
      references: [permission.id],
    }),
  }),
);
