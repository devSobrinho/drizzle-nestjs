import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SeedCustomerEmployeeDto {
  @ApiProperty({
    description: 'Quantidade de registros usuarios a serem criados',
  })
  @IsNumber()
  qtd: number;

  @ApiProperty({
    description:
      'Id do customer para o qual os registros serão criados do usuario',
  })
  @IsString()
  customerId: string;
}
