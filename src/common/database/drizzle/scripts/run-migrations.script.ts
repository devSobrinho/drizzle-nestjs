import 'dotenv/config';
import { DatabaseMigrationsHelper } from '../helpers/database-migrations.helper';
import { migrationReplaceAll } from './migration-replace.script';

const migrationsFolderMain = './src/common/database/drizzle/migrations/app';

async function startMigrations() {
  try {
    await migrationReplaceAll();
    console.log('[MAIN] Migrations complete');

    const schemas = ['tenant_default', 'tenant_1', 'tenant_2'];
    for (const schemaName of schemas) {
      await DatabaseMigrationsHelper.runApp(schemaName, migrationsFolderMain);
    }
    console.log('[TENANT] All Migrations complete');
  } catch (error) {
    console.log('Error in startMigrations', error);
  }
}

startMigrations();
