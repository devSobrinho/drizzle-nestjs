import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RequestContextModule } from '../modules/request-context/request-context.module';
import { DatabaseConfig } from './configs/database.config';
import { DrizzleModule } from './drizzle.module';
import { CustomerRepository } from './repositories/customer.repository';
import { UserRepository } from './repositories/user.repository';

const Repositories = [UserRepository, CustomerRepository];

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: () => DatabaseConfig.credentials,
    }),
    RequestContextModule,
    DrizzleModule,
  ],
  providers: [...Repositories, DatabaseConfig],
  exports: Repositories,
})
export class DatabaseModule {}
