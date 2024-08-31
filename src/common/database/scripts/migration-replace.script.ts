import * as fs from 'fs';
import * as path from 'path';

async function replacePublicFileSQL(pathFolder: string) {
  const files = await fs.promises.readdir(pathFolder);
  for (const file of files) {
    const filePath = path.join(pathFolder, file);

    if (filePath.endsWith('.sql')) {
      const content = await fs.promises.readFile(filePath, 'utf8');
      const newContent = content.replace(new RegExp(/"public"./, 'g'), '');
      await fs.promises.writeFile(filePath, newContent);
    }
  }
}

export async function migrationReplaceAll() {
  const pathFolderApp = path.join(__dirname, '..', 'migrations', 'app');
  const pathFolderTenantDefault = path.join(
    __dirname,
    '..',
    'migrations',
    'tenant_default',
  );

  await replacePublicFileSQL(pathFolderApp);
  await replacePublicFileSQL(pathFolderTenantDefault);
}
