import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CustomerEntity,
  EntitiesSchema,
  TenantEntity,
  USER_STATUS_ENUM,
  UserEntity,
} from 'src/common/database/entities/entities.schema';
import { TransactionService } from 'src/common/database/transaction.service';
import { FakerHelper } from 'src/common/helpers/faker';
import { BcryptHashingService } from 'src/common/modules/hashing/hashing.service';
import { SeedAdminTenantDto } from '../dtos/admin-tenant.dto';
import { SeedCustomerAdminDto } from '../dtos/customer-admin.dto';
import { SeedCustomerEmployeeDto } from '../dtos/customer-employee.dto';
import { BaseFactory } from './base.factory';

@Injectable()
export class UserFactory {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly baseFactory: BaseFactory,
  ) {}

  private async createUser(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    data?: Partial<UserEntity>,
  ) {
    const bcrypt = new BcryptHashingService();
    const password = await bcrypt.hash('123456');
    const result = await db
      .insert(EntitiesSchema.user)
      .values({
        email: faker.internet.email().toLowerCase(),
        password,
        status: USER_STATUS_ENUM.ACTIVATED,
        ...data,
      })
      .returning();
    return result[0];
  }

  private async createTenant(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    data?: Partial<TenantEntity>,
  ) {
    const result = await db
      .insert(EntitiesSchema.tenant)
      .values({
        cnpj: FakerHelper.person.cnpj(),
        name: faker.company.name(),
        email: faker.internet.email().toLowerCase(),
        address: faker.address.street(),
        city: faker.address.city(),
        cep: faker.address.zipCode(),
        country: faker.address.country(),
        state: faker.address.state(),
        number: faker.address.buildingNumber(),
        phone: faker.phone.number(),
        ...data,
      })
      .returning();

    return result[0];
  }

  private async createCustomer(
    db: PostgresJsDatabase<typeof EntitiesSchema>,
    data?: Partial<CustomerEntity>,
  ) {
    const customer: Partial<CustomerEntity> = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      ...data,
    };
    const result = await db
      .insert(EntitiesSchema.customer)
      .values(customer as CustomerEntity)
      .returning();
    return result[0];
  }

  public async createUserAdminTenant({ qtd }: SeedAdminTenantDto) {
    return await this.transactionService.execute(async (db) => {
      const users: Partial<UserEntity>[] = [];
      const tenants: Partial<TenantEntity>[] = [];
      for (let index = 0; index < qtd; index++) {
        const userCreated = await this.createUser(db);
        const tenant = await this.createTenant(db, {
          email: userCreated.email,
        });
        const userUpdated = await db
          .update(EntitiesSchema.user)
          .set({
            tenantId: tenant.id,
          } as UserEntity)
          .where(eq(EntitiesSchema.user.id, userCreated.id))
          .returning();
        users.push(userUpdated[0]);
        tenants.push(tenant);
      }

      return { users, tenants };
    });
  }

  public async createUserCustomerAdmin({
    tenantId,
    qtd,
  }: SeedCustomerAdminDto) {
    return await this.transactionService.execute(async (db) => {
      const users: Partial<UserEntity>[] = [];
      const customers: Partial<CustomerEntity>[] = [];
      for (let index = 0; index < qtd; index++) {
        await this.baseFactory.setSchema(db, tenantId);
        const userCreated = await this.createUser(db, {
          tenantId,
        });
        const customer = await this.createCustomer(db, {
          email: userCreated.email,
        });
        const userUpdated = await db
          .update(EntitiesSchema.user)
          .set({
            customerId: customer.id,
          } as UserEntity)
          .where(eq(EntitiesSchema.user.id, userCreated.id))
          .returning();
        users.push(userUpdated[0]);
        customers.push(customer);
      }

      return { users, customers };
    });
  }

  public async createUserCustomerEmployee({
    customerId,
    qtd,
  }: SeedCustomerEmployeeDto) {
    return await this.transactionService.execute(async (db) => {
      const users: Partial<UserEntity>[] = [];
      for (let index = 0; index < qtd; index++) {
        const customer = await db.query.user.findFirst({
          where: eq(EntitiesSchema.user.customerId, customerId),
        });

        if (!customer) throw new NotFoundException('Customer não existe');
        if (!customer.tenantId)
          throw new NotFoundException('Tenant não existe');

        await this.baseFactory.setSchema(db, customer.tenantId);
        const userCreated = await this.createUser(db, {
          tenantId: customer.tenantId,
          customerId,
        });

        users.push(userCreated);
      }

      return { users };
    });
  }
}
