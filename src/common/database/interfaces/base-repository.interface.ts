export interface BaseRepositoryImpl<T = any, K = T, U = T> {
  getAll(): Promise<T[]>;
  getById: (id: string, fields?: (keyof T)[]) => Promise<Partial<K>[]>;
  getOneById: (id: string, fields?: (keyof T)[]) => Promise<Partial<K>>;
  getBySingleKey: (
    key: keyof T,
    value: any,
    fields?: (keyof T)[],
  ) => Promise<Partial<K>[]>;
  getOneBySingleKey: (
    key: keyof T,
    value: any,
    fields?: (keyof T)[],
  ) => Promise<Partial<K>>;
  insert: (entity: Partial<U>) => Promise<Partial<K>>;
  updateById: (
    id: string | number,
    entity: Partial<U>,
  ) => Promise<Partial<K>[]>;
  deleteById: (id: string | number) => Promise<Partial<K>[]>;
  deleteAll: () => Promise<Partial<K>[]>;
}
