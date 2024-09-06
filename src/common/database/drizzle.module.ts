import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RequestContextModule } from '../modules/request-context/request-context.module';
import { RequestContextService } from '../modules/request-context/request-context.service';
import { DatabaseConfig } from './configs/database.config';
import { ConnectionManager, PG_CONNECTION } from './pg-connection';

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
        let schemaName = dbConfig.schemaName;
        const user = requestContextService.getUser();
        if (user?.tenantId) schemaName = `tenant_${user.tenantId}`;
        const db = ConnectionManager.getConnection(schemaName);
        return db;
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
