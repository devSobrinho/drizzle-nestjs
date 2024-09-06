import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SeedAdminTenantDto {
  @ApiProperty({ description: 'Quantidade de registros a serem criados' })
  @IsNumber()
  qtd: number;
}
