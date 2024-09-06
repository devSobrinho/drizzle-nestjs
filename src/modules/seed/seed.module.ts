import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { SeedController } from './controllers/seed.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UserFactory } from './factories/user.factory';
import { SeedUserController } from './controllers/seed-user.controller';
import { SeedUserService } from './services/seed-user.service';
import { BaseFactory } from './factories/base.factory';
import { SeedProductController } from './controllers/seed-product.controller';
import { ProductFactory } from './factories/product.factory';
import { SeedProductService } from './services/seed-product.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SeedController, SeedUserController, SeedProductController],
  providers: [
    BaseFactory,
    SeedService,
    SeedUserService,
    SeedProductService,
    UserFactory,
    ProductFactory,
  ],
})
export class SeedModule {}
