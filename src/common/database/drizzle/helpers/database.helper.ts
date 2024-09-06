import { Table } from 'drizzle-orm';

export class DatabaseHelper {
  static useDynamicSchema = <T extends Table>(table: T, schema: string): T => {
    // @ts-expect-error Symbol is @internal in drizzle-orm, see https://github.com/drizzle-team/drizzle-orm/blob/0.30.4/drizzle-orm/src/table.ts#L64-L65
    table[Table.Symbol.Schema] = schema;
    return table;
  };
}
