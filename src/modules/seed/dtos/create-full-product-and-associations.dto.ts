import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFullProductAndAssociationsDto {
  @ApiProperty({ description: 'Quantidade de registros a serem criados' })
  @IsNumber()
  qtd: number;

  @ApiProperty({
    description:
      'Id do tenant para o qual os registros serão criados do usuario',
  })
  @IsNumber()
  tenantId: number;
}
