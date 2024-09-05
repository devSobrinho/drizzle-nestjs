import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [DatabaseModule, UploadModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
