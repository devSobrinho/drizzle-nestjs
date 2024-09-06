import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RequestContextModule } from '../modules/request-context/request-context.module';
import { DatabaseConfig } from './configs/database.config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { CustomerRepository } from './drizzle/repositories/customer.repository';
import { UserRepository } from './drizzle/repositories/user.repository';
import { TransactionDrizzleService } from './drizzle/transaction.service';

const Repositories = [UserRepository, CustomerRepository];

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: () => DatabaseConfig.credentials,
    }),
    RequestContextModule,
    DrizzleModule,
  ],
  providers: [...Repositories, DatabaseConfig, TransactionDrizzleService],
  exports: [...Repositories, TransactionDrizzleService],
})
export class DatabaseModule {}
