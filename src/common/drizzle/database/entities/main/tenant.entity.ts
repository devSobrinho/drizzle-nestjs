import * as d from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user.entity';
import { role } from './role.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

const schemaMain = d.pgSchema('main');

// ------- TENANT TABLE ---------
export const tenant = schemaMain.table('tenant', {
  ...BaseEntityHelper.idPrimaryKey,
  name: d.varchar('name', { length: 256 }),
  cep: d.varchar('cep', { length: 256 }),
  address: d.varchar('address', { length: 256 }),
  number: d.integer('number'),
  city: d.varchar('city', { length: 256 }),
  state: d.varchar('state', { length: 256 }),
  country: d.varchar('country', { length: 256 }),
  phone: d.varchar('phone', { length: 256 }),
  email: d.varchar('email', { length: 256 }).notNull(),
  cnpj: d.varchar('cnpj', { length: 256 }).notNull(),
  ...BaseEntityHelper.timestampColumns,
});

// RELATIONS
export const tenantRelations = relations(tenant, ({ many }) => ({
  users: many(user), // MANY TO ONE RELATION
  roles: many(role), // MANY TO ONE RELATION
}));

export type TenantEntity = typeof tenant.$inferSelect;
export type TenantEntityInsert = typeof tenant.$inferInsert;
