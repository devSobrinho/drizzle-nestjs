import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinIoClient } from './minio-client';

@Module({
  controllers: [UploadController],
  providers: [UploadService, MinIoClient],
})
export class UploadModule {}
