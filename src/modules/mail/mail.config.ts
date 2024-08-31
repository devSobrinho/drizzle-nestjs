import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { Injectable } from '@nestjs/common';
import {
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

@Injectable()
export class MailConfig {
  static get transport() {
    return MailConfig.validateCredentials();
  }

  private static validateCredentials(): TransportType {
    const credentialsDto = new MailCredentialsDTO();
    Object.assign(credentialsDto, {
      ...process.env,
      MAIL_PORT: parseInt(process.env.MAIL_PORT, 10),
    });
    const errors = validateSync(credentialsDto, { whitelist: true });
    if (errors.length > 0)
      throw new Error(`Mail credentials are invalid: ${errors}`);
    const isProduction = credentialsDto.NODE_ENV === 'production';

    if (isProduction) {
      return {
        host: credentialsDto.MAIL_HOST,
        port: credentialsDto.MAIL_PORT,
        secure: true,
        auth: {
          user: credentialsDto.MAIL_USER,
          pass: credentialsDto.MAIL_PASS,
        },
      };
    }
    return {
      host: credentialsDto.MAIL_HOST,
      port: credentialsDto.MAIL_PORT,
    };
  }
}

class MailCredentialsDTO {
  @IsString()
  @MinLength(1)
  MAIL_HOST: string;
  @IsString()
  @MinLength(1)
  MAIL_USER: string;
  @IsString()
  @MinLength(1)
  MAIL_PASS: string;
  @IsInt()
  MAIL_PORT: number;
  @IsString()
  @IsOptional()
  NODE_ENV: string;
}
