import 'dotenv/config';
import { DatabaseMigrationsHelper } from '../database/helpers/database-migrations.helper';

const migrationsFolder = './src/common/drizzle/migrations';

async function startMigrations() {
  const schemas = ['tenant_default', 'tenant_1', 'tenant_2'];
  try {
    for (const schemaName of schemas) {
      await DatabaseMigrationsHelper.run(schemaName, migrationsFolder);
    }
    console.log('[TENANT] All Migrations complete');
  } catch (error) {
    console.log('Error in startMigrations', error);
  }
}

startMigrations();
