import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CategoryEntity,
  EntitiesSchema,
  PRODUCT_STATUS_ENUM,
  PRODUCT_TYPE_ENUM,
} from 'src/common/database/drizzle/entities/entities.schema';
import {
  ProductVariantEntity,
  VariantTypeEntity,
} from 'src/common/database/drizzle/entities/tenant';
import { TransactionDrizzleService } from 'src/common/database/drizzle/transaction.service';

import { MockVariantsTypesName } from '../_mocks/_variant-type.mock';
import { CreateFullProductAndAssociationsDto } from '../dtos/create-full-product-and-associations.dto';
import { BaseFactory } from './base.factory';

@Injectable()
export class ProductFactory {
  constructor(
    private readonly transactionDrizzleService: TransactionDrizzleService,
    private readonly baseFactory: BaseFactory,
  ) {}

  private async associateProductVariantWithVariantTypeAndGenerationVariantValue(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    productVariantId: string,
    variantTypeId: string,
    type: string,
  ) {
    let variantValue = '';
    if (type === 'Color') {
      variantValue = faker.color.human();
    } else {
      variantValue = ['P', 'M', 'G', 'GG', 'XG'][Math.floor(Math.random() * 5)];
    }

    await db
      .insert(EntitiesSchema.productVariantType)
      .values({
        productVariantId,
        variantTypeId,
        variantValue,
      })
      .returning();
  }

  private async createVariantType(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    name: string,
  ) {
    const result = await db
      .insert(EntitiesSchema.variantType)
      .values({ name })
      .returning();

    return result[0];
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
    return await this.transactionDrizzleService.execute(async (db) => {
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
        const variantsTypes: VariantTypeEntity[] = [];
        const namesVariantTypes = [
          MockVariantsTypesName.Color,
          MockVariantsTypesName.Size,
        ];
        for (let index = 0; index < namesVariantTypes.length; index++) {
          const name = namesVariantTypes[index];
          const variant = await db
            .transaction(async (db) => {
              return await this.createVariantType(db, name);
            })
            .catch(async () => {
              const result = await db
                .select()
                .from(EntitiesSchema.variantType)
                .where(eq(EntitiesSchema.variantType.name, name));
              return result[0];
            });
          variantsTypes.push(variant);
        }
        for (let index = 0; index < productsVariants.length; index++) {
          const productVariant = productsVariants[index];
          for (let index = 0; index < 1; index++) {
            await this.associateProductVariantWithVariantTypeAndGenerationVariantValue(
              db,
              productVariant.id,
              variantsTypes[0].id,
              namesVariantTypes[0],
            );
            await this.associateProductVariantWithVariantTypeAndGenerationVariantValue(
              db,
              productVariant.id,
              variantsTypes[1].id,
              namesVariantTypes[1],
            );
          }
        }
      }
      return await db.query.product.findMany({
        with: {
          categoryProducts: { with: { category: true } },
          variants: {
            with: { productVariantTypes: { with: { variantType: true } } },
          },
        },
      });
    });
  }
}
