import { Body, Controller, Post } from '@nestjs/common';
import { PublicRouter } from 'src/common/decorators/api/public-router.decorator';

import { CreateFullProductAndAssociationsDto } from '../dtos/create-full-product-and-associations.dto';
import { SeedProductService } from '../services/seed-product.service';

@Controller('seed/product')
export class SeedProductController {
  constructor(private readonly seedProductService: SeedProductService) {}

  @Post('full-product-and-associations')
  @PublicRouter()
  fullProductAndAssociations(
    @Body() data: CreateFullProductAndAssociationsDto,
  ) {
    return this.seedProductService.createFullProductAndAssociations(data);
  }
}
