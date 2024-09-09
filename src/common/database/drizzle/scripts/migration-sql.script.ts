import * as fs from 'fs';
import * as path from 'path';
import { contentSqlMainTxt } from '../sql/main';
import { contentSqlTenantTxt } from '../sql/tenant';

// type Item = { functions: string[]; triggers: string[] };
// type MigrationSqlScripts = {
//   main: Item;
//   tenant: Item;
// };

// const migrationSqlScripts: MigrationSqlScripts = {
//   main: {
//     functions: [
//       'lowercase-email',
//       'lowercase-name',
//       'mask-postal-code',
//       'format-postal-code',
//     ],
//     triggers: [
//       'user-set-email-lowercase',
//       'tenant-set-email-lowercase',
//       'role-set-name-lowercase',
//       'permission-set-name-lowercase',
//     ],
//   },
//   tenant: {
//     functions: [],
//     triggers: ['address-set-mask-postal-code', 'customer-set-email-lowercase'],
//   },
// };

const pathFolderMigrationApp = path.join(__dirname, '..', 'migrations', 'app');
const pathFolderMigrationTenant = path.join(
  __dirname,
  '..',
  'migrations',
  'tenant',
);
// const pathFolderMainSql = path.join(__dirname, '..', 'sql');
// const pathFolderTenantSql = path.join(__dirname, '..', 'sql', 'tenant');
export async function generationTriggersAndFunctions() {
  console.log('>>> contentSqlMainTxt', contentSqlMainTxt);
  console.log('>>> contentSqlTenantTxt', contentSqlTenantTxt);

  // const { main, tenant } = migrationSqlScripts;
  // const mainFunctions = main.functions;
  // const mainTriggers = main.triggers;
  // const tenantFunctions = tenant.functions;
  // const tenantTriggers = tenant.triggers;

  // // FUNCTIONS MAIN
  // let contentSqlFunctionsMain = '';
  // for (const file of mainFunctions) {
  //   const content = await fs.promises.readFile(
  //     path.join(pathFolderMainSql, 'functions', file + '.sql'),
  //     'utf8',
  //   );
  //   contentSqlFunctionsMain += '\n' + content;
  // }
  // // TRIGGERS MAIN
  // let contentSqlTriggersMain = '';
  // for (const file of mainTriggers) {
  //   const content = await fs.promises.readFile(
  //     path.join(pathFolderMainSql, 'triggers', file + '.sql'),
  //     'utf8',
  //   );
  //   contentSqlTriggersMain += '\n' + content;
  // }

  // // FUNCTIONS TENANT
  // let contentSqlFunctionsTenant = '';
  // for (const file of tenantFunctions) {
  //   const content = await fs.promises.readFile(
  //     path.join(pathFolderTenantSql, 'functions', file + '.sql'),
  //     'utf8',
  //   );
  //   contentSqlFunctionsTenant += '\n' + content;
  // }

  // // TRIGGERS TENANT
  // let contentSqlTriggersTenant = '';
  // for (const file of tenantTriggers) {
  //   const content = await fs.promises.readFile(
  //     path.join(pathFolderTenantSql, 'triggers', file + '.sql'),
  //     'utf8',
  //   );
  //   contentSqlTriggersTenant += '\n' + content;
  // }

  // console.log(
  //   '>>>',
  //   contentSqlFunctionsMain,
  //   contentSqlTriggersMain,
  //   contentSqlFunctionsTenant,
  //   contentSqlTriggersTenant,
  // );
}
