import { Inject } from '@nestjs/common';
import { eq, Table } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DatabaseHelper } from '../helpers/database.helper';
import { PG_CONNECTION } from '../../pg-connection';

export class BaseDao<
  TSchema extends Record<string, unknown>,
  Entity extends Table,
  InferEntitySelected,
  InferEntityInsert,
> {
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<TSchema>,
    private readonly entity: Entity,
  ) {}

  protected get useSchema() {
    return DatabaseHelper.useDynamicSchema(this.entity, 'this.db.schema');
  }

  async getAll() {
    return await this.db.select().from(this.useSchema).execute();
  }

  async getById(
    id: string,
    fields?: (keyof Entity)[],
  ): Promise<Partial<InferEntitySelected>[]> {
    const selectedFields = this.selectFields(fields);
    return await this.db
      .select(selectedFields)
      .from(this.useSchema)
      .where(eq(this.entity['id'], id));
  }

  async getOneById(
    id: string,
    fields?: (keyof Entity)[],
  ): Promise<Partial<InferEntitySelected>> {
    const selectedFields = this.selectFields(fields);
    const result = await this.db
      .select(selectedFields)
      .from(this.useSchema)
      .where(eq(this.entity['id'], id))
      .limit(1);
    return result && result.length > 0 ? result[0] : null;
  }

  async getBySingleKey(
    key: keyof Entity,
    value: any,
    fields?: (keyof Entity)[],
  ): Promise<Partial<InferEntitySelected>[]> {
    const selectedFields = this.selectFields(fields);
    return await this.db
      .select(selectedFields)
      .from(this.useSchema)
      .where(eq(this.entity[key as string], value))
      .execute();
  }

  async getOneBySingleKey(
    key: keyof Entity,
    value: any,
    fields?: (keyof Entity)[],
  ): Promise<Partial<InferEntitySelected>> {
    const selectedFields = this.selectFields(fields);
    const result = await this.db
      .select(selectedFields)
      .from(this.useSchema)
      .where(eq(this.entity[key as string], value))
      .limit(1)
      .execute();
    return result && result.length > 0 ? result[0] : null;
  }

  async insert(entity: Partial<InferEntityInsert>) {
    const insertedRows = await this.db
      .insert(this.useSchema)
      .values(entity as InferEntityInsert)
      .returning()
      .execute();
    return insertedRows;
  }

  async updateByIb(id: string, entity: Partial<InferEntityInsert>) {
    const updatedRows = await this.db
      .update(this.useSchema)
      .set(entity as InferEntityInsert)
      .where(eq(this.entity['id'], id))
      .returning()
      .execute();
    return updatedRows;
  }

  async deleteById(id: string) {
    const deletedRows = await this.db
      .delete(this.useSchema)
      .where(eq(this.entity['id'], id))
      .returning()
      .execute();
    return deletedRows;
  }

  async deleteAll() {
    const deletedRows = await this.db
      .delete(this.useSchema)
      .returning()
      .execute();
    return deletedRows;
  }

  private selectFields(fields?: (keyof Entity)[]) {
    if (!fields || fields?.length === 0) return undefined;

    return fields.reduce((acc, field) => {
      acc[field as string] = this.entity[field];
      return acc;
    }, {});
  }
}
