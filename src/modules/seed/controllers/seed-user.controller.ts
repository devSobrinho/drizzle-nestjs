import { Body, Controller, Post } from '@nestjs/common';
import { SeedUserService } from '../services/seed-user.service';
import { PublicRouter } from 'src/common/decorators/api/public-router.decorator';
import { SeedAdminTenantDto } from '../dtos/admin-tenant.dto';
import { SeedCustomerAdminDto } from '../dtos/customer-admin.dto';
import { SeedCustomerEmployeeDto } from '../dtos/customer-employee.dto';

@Controller('seed/user')
export class SeedUserController {
  constructor(private readonly seedUserService: SeedUserService) {}

  @Post('admin-tenant')
  @PublicRouter()
  userAdminTenant(@Body() data: SeedAdminTenantDto) {
    return this.seedUserService.userAdminTenant(data);
  }

  @Post('customer-admin')
  @PublicRouter()
  userCustomerAdmin(@Body() data: SeedCustomerAdminDto) {
    return this.seedUserService.userCustomerAdmin(data);
  }

  @Post('customer-employee')
  @PublicRouter()
  userCustomerEmployee(@Body() data: SeedCustomerEmployeeDto) {
    return this.seedUserService.userCustomerEmployee(data);
  }
}
