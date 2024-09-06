import { EntitiesSchema } from './entities/entities.schema';
import { Pool } from 'pg';
import { DatabaseConfig } from './configs/database.config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

export const PG_CONNECTION = 'PG_CONNECTION';

export class ConnectionManager {
  private static prefix = 'tenant_';
  static instances: Map<string, NodePgDatabase<typeof EntitiesSchema>> =
    new Map();

  public static async getConnection(
    schemaName: string,
  ): Promise<NodePgDatabase<typeof EntitiesSchema>> {
    // return this.connection;
    if (this.instances.has(schemaName)) {
      return this.instances.get(schemaName);
    }
    const dbConfig = new DatabaseConfig();
    const pool = new Pool({
      connectionString: dbConfig.postgressqlConnection,
    });
    const db = drizzle(pool, { schema: EntitiesSchema });
    await db.execute(sql.raw(`SET schema '${schemaName}'`));
    ConnectionManager.setConnection(db, schemaName);
    return db;
  }

  private static setConnection(
    connection: NodePgDatabase<typeof EntitiesSchema>,
    schemaName: string,
  ) {
    this.instances.set(schemaName, connection);
  }
}
