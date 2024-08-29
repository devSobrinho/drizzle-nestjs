import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: [`${__dirname}/../database/entities/**/*.entity.ts`],
  out: './src/common/drizzle/migrations/',
  // verbose: false,
  schemaFilter: process.env.DB_SCHEMA_NAME,
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
