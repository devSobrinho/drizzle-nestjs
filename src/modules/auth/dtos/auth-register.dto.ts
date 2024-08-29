import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/common/decorators/validator/strong-password.decorator';

export class AuthRegisterDTO {
  @ApiProperty({ type: 'string', example: 'exemplo@hotmail.com' })
  @IsEmail({ allow_display_name: true }, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ type: 'string', example: 'abcdef123A@' })
  @IsString({ message: 'Tipo inválida' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @IsStrongPassword()
  password: string;
}
