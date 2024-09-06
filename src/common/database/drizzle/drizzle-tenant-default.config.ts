import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: [`${__dirname}/entities/tenant/*.entity.ts`],
  out: './src/common/database/drizzle/migrations/tenant_default',
  // verbose: false,
  schemaFilter: process.env.DB_SCHEMA_NAME,
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
