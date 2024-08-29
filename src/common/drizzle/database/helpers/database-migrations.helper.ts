import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

import * as schema from '../entities/entities.schema';

export class DatabaseMigrationsHelper {
  private static connectionString = process.env.DATABASE_URL;

  static async run(schemaName: string, migrationsFolder: string) {
    const client = new Client({
      connectionString: DatabaseMigrationsHelper.connectionString,
    });
    await client.connect();
    const db = drizzle(client, { schema });

    try {
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS main`);
      await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`));
      await db.execute(sql.raw(`SET schema '${schemaName}'`));
      await migrate(db, { migrationsFolder, migrationsSchema: schemaName });
      await client.end();
    } catch (error) {
      console.log('Error in runMigrations', error);
    }
  }

  static async drop(schemaName: string) {
    const client = new Client({
      connectionString: DatabaseMigrationsHelper.connectionString,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "main" CASCADE`));
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`));
    await client.end();
  }
}
