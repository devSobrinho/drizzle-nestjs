import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRefreshTokenDTO {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
