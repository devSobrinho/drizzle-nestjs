import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DatabaseConfig } from './configs/database.config';
import { EntitiesSchema } from './entities/entities.schema';
import { PG_CONNECTION } from './pg-connection';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: () => DatabaseConfig.credentials,
    }),
  ],
  providers: [
    DatabaseConfig,
    {
      provide: PG_CONNECTION,
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => {
        const pool = new Pool({
          connectionString: dbConfig.postgressqlConnection,
        });
        return drizzle(pool, { schema: EntitiesSchema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
