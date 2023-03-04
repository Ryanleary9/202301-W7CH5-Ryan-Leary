export interface Repo<U> {
  getAll(): Promise<U[]>;
  search(query: { key: string; value: unknown }): Promise<U[]>;
  create(_info: Partial<U>): Promise<U>;
  delete(_id: string): Promise<void>;
}
