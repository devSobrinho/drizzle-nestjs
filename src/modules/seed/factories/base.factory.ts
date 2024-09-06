import { Injectable, NotFoundException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { EntitiesSchema } from 'src/common/database/entities/entities.schema';

@Injectable()
export class BaseFactory {
  public async existSchema(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    tenantId: number,
  ) {
    const result = await db.execute(
      sql.raw(`SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'tenant_${tenantId}';`),
    );
    return !!result['rowCount'];
  }

  public async setSchema(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    tenantId: number,
  ) {
    const existTenant = await this.existSchema(db, tenantId);
    if (!existTenant) throw new NotFoundException('Tenant não existe');
    await db.execute(sql.raw(`SET SCHEMA 'tenant_${tenantId}'`));
  }
}
