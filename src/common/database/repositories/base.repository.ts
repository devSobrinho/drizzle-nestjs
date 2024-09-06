import { Inject } from '@nestjs/common';
import { eq, Table } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DatabaseHelper } from '../helpers/database.helper';
import { DatabaseConfig } from '../configs/database.config';
import { BaseRepositoryImpl } from '../interfaces/base-repository.interface';
import { PG_CONNECTION } from 'src/common/constants/pg-connection.constant';

export class BaseRepository<
  TSchema extends Record<string, unknown>,
  Entity extends Table,
  InferEntitySelected,
  InferEntityInsert,
> implements BaseRepositoryImpl<Entity, InferEntitySelected, InferEntityInsert>
{
  constructor(
    @Inject(PG_CONNECTION)
    protected readonly db: PostgresJsDatabase<TSchema>,
    private readonly entity: Entity,
    protected readonly dbConfig: DatabaseConfig,
  ) {}

  protected get useSchema() {
    return DatabaseHelper.useDynamicSchema(
      this.entity,
      this.dbConfig.schemaName,
    );
  }

  async getAll(): Promise<Entity[]> {
    return (await this.db.select().from(this.useSchema).execute()) as Entity[];
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

  async insert(
    entity: Partial<InferEntityInsert>,
  ): Promise<Partial<InferEntitySelected>> {
    const result = await this.db
      .insert(this.useSchema)
      .values(entity as InferEntityInsert)
      .returning()
      .execute();
    return result && result.length > 0
      ? (result[0] as Partial<InferEntitySelected>)
      : null;
  }

  async updateById(
    id: string | number,
    entity: Partial<InferEntityInsert>,
  ): Promise<Partial<InferEntitySelected>[]> {
    const updatedRows = await this.db
      .update(this.useSchema)
      .set(entity as InferEntityInsert)
      .where(eq(this.entity['id'], id))
      .returning()
      .execute();
    return updatedRows as Partial<InferEntitySelected>[];
  }

  async deleteById(
    id: string | number,
  ): Promise<Partial<InferEntitySelected>[]> {
    const deletedRows = await this.db
      .delete(this.useSchema)
      .where(eq(this.entity['id'], id))
      .returning()
      .execute();
    return deletedRows as Partial<InferEntitySelected>[];
  }

  async deleteAll(): Promise<Partial<InferEntitySelected>[]> {
    const deletedRows = await this.db
      .delete(this.useSchema)
      .returning()
      .execute();
    return deletedRows as Partial<InferEntitySelected>[];
  }

  private selectFields(fields?: (keyof Entity)[]) {
    if (!fields || fields?.length === 0) return undefined;

    return fields.reduce((acc, field) => {
      acc[field as string] = this.entity[field];
      return acc;
    }, {});
  }
}
