import * as d from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user.entity';
import { role } from './role.entity';
import { BaseEntityHelper } from '../../helpers/base-entity.helper';

const schemaMain = d.pgSchema('main');

// ------- TENANT TABLE ---------
export const tenant = schemaMain.table('tenant', {
  id: d.serial('id').primaryKey(),
  name: d.varchar('name', { length: 256 }).notNull(),
  cep: d.varchar('cep', { length: 256 }).notNull(),
  address: d.varchar('address', { length: 256 }).notNull(),
  number: d.varchar('number').notNull(),
  city: d.varchar('city', { length: 256 }).notNull(),
  state: d.varchar('state', { length: 256 }).notNull(),
  country: d.varchar('country', { length: 256 }).notNull(),
  phone: d.varchar('phone', { length: 256 }).notNull(),
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
