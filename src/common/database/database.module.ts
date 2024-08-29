import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle.module';
import { DatabaseConfig } from './configs/database.config';
import { UserRepository } from './repositories/user.repository';

const Repositories = [UserRepository];

@Module({
  providers: [...Repositories, DatabaseConfig],
  imports: [
    ConfigModule.forRoot({
      validate: () => DatabaseConfig.credentials,
    }),
    DrizzleModule,
  ],
  exports: Repositories,
})
export class DatabaseModule {}
