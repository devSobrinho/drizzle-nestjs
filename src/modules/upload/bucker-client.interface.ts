import internal from 'stream';

type GetObjectOpts = {
  versionId?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string;
  SSECustomerKeyMD5?: string;
};

export interface BucketClient {
  createBucket(bucketName: string): Promise<void>;
  existBucket(bucketName: string): Promise<boolean>;
  removeBucket(bucketName: string): Promise<void>;
  getObject(
    bucketName: string,
    objectName: string,
    getOpts?: GetObjectOpts,
  ): Promise<Record<string, any>>;
  uploadObject(
    bucketName: string,
    objectName: string,
    stream: internal.Readable | Buffer | string,
    size?: number,
    metaData?: Record<string, any>,
  ): Promise<Record<string, any>>;
}
