import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { RequestContextModule } from '../modules/request-context/request-context.module';
import { RequestContextService } from '../modules/request-context/request-context.service';
import { DatabaseConfig } from './configs/database.config';
import { EntitiesSchema } from './entities/entities.schema';
import { PG_CONNECTION } from './pg-connection';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: () => DatabaseConfig.credentials,
    }),
    RequestContextModule,
  ],
  providers: [
    DatabaseConfig,
    {
      provide: PG_CONNECTION,
      inject: [DatabaseConfig, RequestContextService],
      useFactory: async (
        dbConfig: DatabaseConfig,
        requestContextService: RequestContextService,
      ) => {
        const pool = new Pool({
          connectionString: dbConfig.postgressqlConnection,
        });
        const db = drizzle(pool, { schema: EntitiesSchema });
        let schemaName = dbConfig.schemaName;
        const user = requestContextService.getUser();
        if (user?.tenantId) schemaName = `tenant_${user.tenantId}`;
        await db.execute(sql.raw(`SET schema '${schemaName}'`));
        return drizzle(pool, { schema: EntitiesSchema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
