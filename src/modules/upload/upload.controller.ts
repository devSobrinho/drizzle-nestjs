import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { PublicRouter } from 'src/common/decorators/api/public-router.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucketName') bucketName: string,
  ) {
    return this.uploadService.upload(bucketName, file);
  }

  @PublicRouter()
  @Post('base64')
  uploadBase64(
    @Body('base64') base64: string,
    @Body('bucketName') bucketName: string,
  ) {
    return this.uploadService.uploadBase64(bucketName, base64);
  }
}
