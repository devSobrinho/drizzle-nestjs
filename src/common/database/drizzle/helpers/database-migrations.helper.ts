import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

import * as schemaTenant from '../entities/tenant';
import * as schemaApp from '../entities/entities.schema';

export class DatabaseMigrationsHelper {
  private static connectionString = process.env.DB_URL;

  static async runTenant(schemaName: string, migrationsFolder: string) {
    const client = await this.connection();
    const db = drizzle(client, { schema: schemaTenant });

    try {
      await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`));
      await db.execute(sql.raw(`SET schema '${schemaName}'`));
      await migrate(db, { migrationsFolder, migrationsSchema: schemaName });
      await client.end();
    } catch (error) {
      console.log('Error in runTenant', error);
    }
  }

  static async dropTenant(schemaName: string) {
    const client = await this.connection();
    const db = drizzle(client, { schema: schemaTenant });
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`));
    await client.end();
  }

  static async runApp(schemaName: string, migrationsFolder: string) {
    const client = await this.connection();
    const db = drizzle(client, { schema: schemaApp });

    try {
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS main`);
      await db.execute(sql.raw(`SET schema '${schemaName}'`));
      await migrate(db, { migrationsFolder, migrationsSchema: schemaName });
      await client.end();
    } catch (error) {
      console.log('Error in runApp', error);
    }
  }

  static async dropMain() {
    const client = await this.connection();
    const db = drizzle(client, { schema: schemaApp });

    try {
      await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "main" CASCADE`));
      await client.end();
    } catch (error) {
      console.log('Error in dropMain', error);
    }
  }

  private static async connection() {
    const client = new Client({
      connectionString: DatabaseMigrationsHelper.connectionString,
    });
    await client.connect();
    return client;
  }
}
