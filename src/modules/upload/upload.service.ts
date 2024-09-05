import { BadRequestException, Injectable } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

import { MinIoClient } from './minio-client';

@Injectable()
export class UploadService {
  constructor(private readonly minIoClient: MinIoClient) {}

  async upload(bucketName: string, file: Express.Multer.File) {
    const fileExtension = file.mimetype.split('/')[1].toLowerCase();
    const fileName = `${uuid()}-${new Date().getTime()}.${fileExtension}`;
    const contentType = file.mimetype;
    const response = await this.minIoClient.uploadObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': contentType },
    );

    return { bucketName, fileName, contentType, presigned: response.presigned };
  }

  async uploadBase64(bucketName: string, base64: string) {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (matches?.length !== 3)
      throw new BadRequestException('Invalid base64 string.');
    const contentType = matches[1];
    const base64Data = matches[2];
    const fileExtension = contentType.split('/')[1].toLowerCase();
    const fileName = `${uuid()}-${new Date().getTime()}.${fileExtension}`;
    const buffer = Buffer.from(base64Data, 'base64');
    const response = await this.minIoClient.uploadObject(
      bucketName,
      fileName,
      buffer,
      buffer.length,
      { 'Content-Type': contentType },
    );

    return { bucketName, fileName, contentType, presigned: response.presigned };
  }

  async getObject(bucketName: string, objectName: string) {
    return this.minIoClient.getObject(bucketName, objectName);
  }
}
