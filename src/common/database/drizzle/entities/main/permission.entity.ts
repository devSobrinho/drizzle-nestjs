import * as d from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { role } from './role.entity';
import { rolePermissions } from './role-permissions.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

const schemaMain = d.pgSchema('main');

// ------- PERMISSION TABLE ---------
export const permission = schemaMain.table(
  'permission',
  {
    ...BaseEntityHelper.idPrimaryKey,
    name: d.varchar('name').notNull(),
    description: d.varchar('description'),
    ...BaseEntityHelper.timestampColumns,
  },
  (table) => {
    return {
      nameUniqueIdx: d.uniqueIndex('permission_name_unique_idx').on(table.name),
    };
  },
);

// RELATIONS
export const permissionRelations = relations(permission, ({ many }) => ({
  roles: many(role), // MANY TO MANY RELATION
  rolePermissions: many(rolePermissions), // *PIVOT TABLE*
}));

export type PermissionEntity = typeof permission.$inferSelect;
export type PermissionEntityInsert = typeof permission.$inferInsert;
