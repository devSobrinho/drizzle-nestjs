import { Injectable } from '@nestjs/common';

import { ProductFactory } from '../factories/product.factory';
import { CreateFullProductAndAssociationsDto } from '../dtos/create-full-product-and-associations.dto';

@Injectable()
export class SeedProductService {
  constructor(private readonly productFactory: ProductFactory) {}

  async createFullProductAndAssociations(
    data: CreateFullProductAndAssociationsDto,
  ) {
    return await this.productFactory.createFullProductWithCategoriesAndVariants(
      data,
    );
  }
}
