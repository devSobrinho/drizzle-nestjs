import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AuthRecoverPasswordDTO {
  @ApiProperty({ type: 'string', example: 'exemplo@hotmail.com' })
  @IsEmail({ allow_display_name: true }, { message: 'Email inválido' })
  email: string;
}
