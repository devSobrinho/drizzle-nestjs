import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDTO {
  @ApiProperty({ type: 'string' })
  message: string;
}
