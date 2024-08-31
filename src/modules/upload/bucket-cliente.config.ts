import { Injectable } from '@nestjs/common';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

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
      BUCKET_PORT: +process.env.DB_PORT,
    });

    const errors = validateSync(credentialsDto, { whitelist: true });
    if (errors.length > 0)
      throw new Error(`Bucket credentials are invalid: ${errors}`);
    const isProduction = credentialsDto.NODE_ENV === 'production';
    const USE_SSL = isProduction;
    return { ...credentialsDto, USE_SSL };
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
  @IsString()
  @IsOptional()
  NODE_ENV: string;
}
