//  ---------------- MAIN ----------------
import * as mainEntities from './main';
export * from './main/permission.entity';
export * from './main/role-permissions.entity';
export * from './main/role.entity';
export * from './main/tenant.entity';
export * from './main/user-roles.entity';
export * from './main/user.entity';

//  ---------------- TENANT ----------------
import * as tenantEntities from './tenant';
export * from './tenant/address.entity';
export * from './tenant/category-product.entity';
export * from './tenant/category.entity';
export * from './tenant/customer.entity';
export * from './tenant/customer-favorite-addresses.entity';
export * from './tenant/inventory.entity';
export * from './tenant/order-item.entity';
export * from './tenant/order.entity';
export * from './tenant/payment.entity';
export * from './tenant/product.entity';
export * from './tenant/warehouse.entity';

export const EntitiesSchema = {
  ...mainEntities,
  ...tenantEntities,
};
