import { Injectable } from '@nestjs/common';
import { IsInt, IsString, Min, MinLength, validateSync } from 'class-validator';

@Injectable()
export class DatabaseConfig {
  get schemaName() {
    const credentials = DatabaseConfig.credentials;
    return credentials.DB_SCHEMA_NAME;
  }

  get postgressqlConnection() {
    const credentials = DatabaseConfig.credentials;
    return `postgresql://${credentials.DB_USER}:${credentials.DB_PASSWORD}@${credentials.DB_HOST}:${credentials.DB_PORT}/${credentials.DB_NAME}`;
  }

  static get credentials() {
    return DatabaseConfig.validateCredentials();
  }

  private static validateCredentials() {
    const credentialsDto = new DatabaseCredentialsDTO();
    Object.assign(credentialsDto, {
      ...process.env,
      DB_PORT: +process.env.DB_PORT,
    });

    const errors = validateSync(credentialsDto, {
      whitelist: true,
    });

    if (errors.length > 0)
      throw new Error(`Database credentials are invalid: ${errors}`);

    return credentialsDto;
  }
}

class DatabaseCredentialsDTO {
  @IsString()
  @MinLength(1)
  DB_HOST: string;
  @IsString()
  @MinLength(1)
  DB_USER: string;
  @IsString()
  @MinLength(1)
  DB_PASSWORD: string;
  @IsInt()
  @Min(0)
  DB_PORT: number;
  @IsString()
  @MinLength(1)
  DB_NAME: string;
  @IsString()
  @MinLength(1)
  DB_SCHEMA_NAME: string;
}
