import { Injectable, NotFoundException } from '@nestjs/common';
import * as MinIo from 'minio';
import {
  GetObjectOpts,
  RemoveObjectsParam,
} from 'minio/dist/main/internal/type';
import internal from 'stream';
import { BucketClient } from './bucker-client.interface';
import { BucketClientConfig } from './bucket-cliente.config';

@Injectable()
export class MinIoClient implements BucketClient {
  private client: MinIo.Client;
  constructor() {
    this.client = new MinIo.Client(BucketClientConfig.params);
  }

  public async createBucket(bucketName: string) {
    const exists = await this.existBucket(bucketName);
    if (exists) throw new NotFoundException('Bucket already exists.');
    await this.client.makeBucket(bucketName, 'us-east-1');
  }

  public async existBucket(bucketName: string) {
    return await this.client.bucketExists(bucketName);
  }

  public async removeBucket(bucketName: string) {
    const exists = await this.existBucket(bucketName);
    if (!exists) throw new NotFoundException('Bucket does not exist.');
    await this.client.removeBucket(bucketName);
  }

  public async getObject(
    bucketName: string,
    objectName: string,
    getOpts?: GetObjectOpts,
  ) {
    const exists = await this.existBucket(bucketName);
    if (!exists) throw new NotFoundException('Object does not exist.');
    return await this.client.getObject(bucketName, objectName, getOpts);
  }

  public async uploadObject(
    bucketName: string,
    objectName: string,
    stream: internal.Readable | Buffer | string,
    size?: number,
    metaData?: MinIo.ItemBucketMetadata,
  ) {
    const exists = await this.existBucket(bucketName);
    if (!exists) throw new NotFoundException('Bucket does not exist.');
    return await this.client.putObject(
      bucketName,
      objectName,
      stream,
      size,
      metaData,
    );
  }

  public async removeObject(bucketName: string, objectName: string) {
    await this.client.removeObject(bucketName, objectName);
  }

  public async removeObjects(
    bucketName: string,
    objectNames: RemoveObjectsParam,
  ) {
    return await this.client.removeObjects(bucketName, objectNames);
  }
}
