import { Injectable } from '@nestjs/common';
import { UserFactory } from '../factories/user.factory';
import { SeedAdminTenantDto } from '../dtos/admin-tenant.dto';
import { SeedCustomerAdminDto } from '../dtos/customer-admin.dto';
import { SeedCustomerEmployeeDto } from '../dtos/customer-employee.dto';

@Injectable()
export class SeedUserService {
  constructor(private readonly userFactory: UserFactory) {}

  async userAdminTenant(data: SeedAdminTenantDto) {
    return await this.userFactory.createUserAdminTenant(data);
  }

  async userCustomerAdmin(data: SeedCustomerAdminDto) {
    return await this.userFactory.createUserCustomerAdmin(data);
  }

  async userCustomerEmployee(data: SeedCustomerEmployeeDto) {
    return await this.userFactory.createUserCustomerEmployee(data);
  }
}
