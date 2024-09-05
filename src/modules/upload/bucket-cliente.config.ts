import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';
import * as MinIo from 'minio';

@Injectable()
export class BucketClientConfig {
  static get credentials() {
    return BucketClientConfig.validateCredentials();
  }

  static get params() {
    const credentials = BucketClientConfig.validateCredentials();

    return {
      endPoint: credentials.BUCKET_HOST,
      port: credentials.BUCKET_PORT,
      useSSL: credentials.USE_SSL,
      accessKey: credentials.BUCKET_ACCESS_KEY,
      secretKey: credentials.BUCKET_SECRET_KEY,
    };
  }

  private static validateCredentials() {
    const credentialsDto = new BucketClientCredentialsDTO();
    Object.assign(credentialsDto, {
      ...process.env,
      BUCKET_PORT: +process.env.BUCKET_PORT,
      BUCKET_USE_SSL: process.env.BUCKET_USE_SSL === 'true',
    });

    const errors = validateSync(credentialsDto, { whitelist: true });
    if (errors.length > 0)
      throw new Error(`Bucket credentials are invalid: ${errors}`);
    return { ...credentialsDto, USE_SSL: credentialsDto.BUCKET_USE_SSL };
  }

  static async start(client: MinIo.Client) {
    return await client.bucketExists('teste');
  }
}

class BucketClientCredentialsDTO {
  @IsString()
  @MinLength(1)
  BUCKET_HOST: string;
  @IsInt()
  @Min(0)
  BUCKET_PORT: number;
  @IsString()
  @MinLength(1)
  BUCKET_ACCESS_KEY: string;
  @IsString()
  @MinLength(1)
  BUCKET_SECRET_KEY: string;
  @IsBoolean()
  @IsOptional()
  BUCKET_USE_SSL?: boolean;
  @IsString()
  @IsOptional()
  BUCKET_DEFAULT_NAME?: string;
}
