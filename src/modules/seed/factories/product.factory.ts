import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CategoryEntity,
  EntitiesSchema,
  PRODUCT_STATUS_ENUM,
  PRODUCT_TYPE_ENUM,
} from 'src/common/database/entities/entities.schema';
import {
  ProductVariantEntity,
  VariantTypeEntity,
} from 'src/common/database/entities/tenant';
import { TransactionService } from 'src/common/database/transaction.service';

import * as VariantTypeSchema from '../../../common/database/entities/tenant/variant-type.entity';
import { CreateFullProductAndAssociationsDto } from '../dtos/create-full-product-and-associations.dto';
import { BaseFactory } from './base.factory';

@Injectable()
export class ProductFactory {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly baseFactory: BaseFactory,
  ) {}

  private async associateProductVariantWithVariantTypeAndGenerationVariantValue(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    productVariantId: string,
    variantTypeId: string,
    type: 'Color' | 'Size',
  ) {
    let variantValue = '';
    if (type === 'Color') {
      variantValue = faker.color.human();
    } else {
      variantValue = ['P', 'M', 'G', 'GG', 'XG'][Math.floor(Math.random() * 5)];
    }

    try {
      await db
        .insert(EntitiesSchema.productVariantType)
        .values({
          productVariantId,
          variantTypeId,
          variantValue,
        })
        .returning();
    } catch (error) {}
  }

  private async createVariantsTypes(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    names: string[],
  ) {
    const variantsTypes: VariantTypeEntity[] = [];
    for (let index = 0; index < names.length; index++) {
      const name = names[index];
      try {
        const result = await db
          .insert(EntitiesSchema.variantType)
          .values({ name })
          .returning();

        variantsTypes.push(result[0]);
      } catch (error) {
        console.log('error', error);

        try {
          // const result = await db.query.variantType
          //   .findFirst({
          //     where: sql`${EntitiesSchema.variantType.name} = '${name}'`,
          //   })
          // .execute();
          console.log(Object.keys(db._.schema));

          const result = await db
            .select()
            .from(VariantTypeSchema.variantType)
            .where(
              sql`${VariantTypeSchema.variantType.name} In('Color', 'Size')`,
            )
            .execute();
          // .where(eq(EntitiesSchema.variantType.name, name))
          // .execute()
          console.log('result', result);

          // variantsTypes.push(...result);
        } catch (error) {
          console.log('error2', error);
          throw error;
        }
      }
    }
    return variantsTypes;
  }

  private async createdProductVariants(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    productId: string,
    qtd: number,
  ) {
    const productsVariants: ProductVariantEntity[] = [];
    for (let index = 0; index < qtd; index++) {
      const productVariantCreated = await db
        .insert(EntitiesSchema.productVariant)
        .values({
          productId,
          barcode: faker.lorem.text().substring(0, 13),
          price: faker.commerce.price(),
          quantity: Math.floor(Math.random() * 100),
        } as ProductVariantEntity)
        .returning();

      productsVariants.push(productVariantCreated[0]);
    }
    return productsVariants;
  }

  private async associateCategoryWithProduct(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    categoryId: string,
    productId: string,
  ) {
    await db
      .insert(EntitiesSchema.categoryProduct)
      .values({
        categoryId,
        productId,
      })
      .returning();
  }

  private async createCategory(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    data?: Partial<CategoryEntity>,
  ) {
    const result = await db
      .insert(EntitiesSchema.category)
      .values({
        name: faker.commerce.department(),
        description: faker.lorem.text().substring(0, 50),
        ...data,
      })
      .returning();

    return result[0];
  }

  private async createProduct(db: PostgresJsDatabase<typeof EntitiesSchema>) {
    const productCreated = await db
      .insert(EntitiesSchema.product)
      .values({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        basePrice: faker.commerce.price(),
        status: PRODUCT_STATUS_ENUM.ACTIVATED,
        type: PRODUCT_TYPE_ENUM.STOCK,
      })
      .returning();
    return productCreated[0];
  }

  public async createFullProductWithCategoriesAndVariants({
    qtd,
    tenantId,
  }: CreateFullProductAndAssociationsDto) {
    return await this.transactionService.execute(async (db) => {
      await this.baseFactory.setSchema(db, tenantId);
      const categoryCreated = await this.createCategory(db);
      for (let index = 0; index < qtd; index++) {
        const categoryId = categoryCreated.id;
        const productCreated = await this.createProduct(db);
        const productId = productCreated.id;
        await this.associateCategoryWithProduct(db, categoryId, productId);
        const productsVariants = await this.createdProductVariants(
          db,
          productId,
          20,
        );
        // const typesName = [
        //   MockVariantsTypesName.Color,
        //   MockVariantsTypesName.Size,
        // ];
        // const variantsTypes = await this.createVariantsTypes(db, typesName);
        // const variantsTypesFiltered = variantsTypes.filter((item) =>
        //   typesName.includes(item.name),
        // );
        for (let index = 0; index < productsVariants.length; index++) {
          const productVariant = productsVariants[index];
          for (let index = 0; index < 1; index++) {
            await this.associateProductVariantWithVariantTypeAndGenerationVariantValue(
              db,
              productVariant.id,
              'b5f94416-212d-418e-88d7-3eeb38a4d02d',
              'Color',
            );
            await this.associateProductVariantWithVariantTypeAndGenerationVariantValue(
              db,
              productVariant.id,
              'bb00afa4-5878-48cf-a25f-20f5c708e746',
              'Size',
            );
          }
        }
      }
      // return products;
      return await db.query.product.findMany();
    });
  }
}
