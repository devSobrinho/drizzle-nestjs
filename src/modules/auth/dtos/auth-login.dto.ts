import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/common/decorators/validator/strong-password.decorator';

export class AuthLoginDTO {
  @ApiProperty({ type: 'string', example: 'exemplo@hotmail.com' })
  @IsEmail({ allow_display_name: true }, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ type: 'string', example: 'abcdef123A@' })
  @IsString({ message: 'Tipo inválida' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @IsStrongPassword()
  password: string;
}

export class AuthUserResponseDTO {
  @Expose()
  @ApiProperty({ type: 'string' })
  id: string;
  @Expose()
  @ApiProperty({ type: 'string' })
  email: string;
  @Expose()
  @ApiProperty({ type: 'string' })
  tenantId: number;
}

export class AuthResponseDTO {
  @ApiProperty({ type: AuthUserResponseDTO })
  user: AuthUserResponseDTO;
  @ApiProperty({ type: 'string' })
  accessToken: string;
  @ApiProperty({ type: 'string' })
  refreshToken: string;
}
