import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Passar o refreshToken',
  })
  @Expose()
  @IsString()
  token: string;
}

export interface JwtDTO extends PayloadGenerateTokenDTO {
  iat: number;
  exp: number;
}

export class PayloadGenerateTokenDTO {
  @ApiProperty()
  @Expose()
  @IsString()
  id: string;
  @ApiProperty()
  @Expose()
  @IsString()
  email: string;
  @ApiProperty()
  @Expose()
  @IsNumber()
  tenantId: number;
}

export class GenerateTokensResponse {
  @ApiProperty({ type: 'string' })
  accessToken: string;
  @ApiProperty({ type: 'string' })
  refreshToken: string;
}

// export class RefreshTokenResponse extends TokenResponse {
//   @ApiProperty({ type: UsuarioDTO })
//   user: UsuarioDTO;
// }
