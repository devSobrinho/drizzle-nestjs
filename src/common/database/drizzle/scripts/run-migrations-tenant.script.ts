import 'dotenv/config';
import { DatabaseMigrationsHelper } from '../helpers/database-migrations.helper';

const migrationsFolder =
  './src/common/database/drizzle/migrations/tenant_default';

export async function startMigrationTenant(tenantId: number) {
  try {
    const schemaName = `tenant_${tenantId}`;
    await DatabaseMigrationsHelper.runTenant(schemaName, migrationsFolder);
    console.log(`[TENANT] Migrations complete for tenant ${tenantId}`);
  } catch (error) {
    console.log('Error in startMigrations', error);
  }
}
