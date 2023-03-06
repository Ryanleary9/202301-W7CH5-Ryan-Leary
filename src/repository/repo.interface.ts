export interface Repo<U> {
  getAll(): Promise<U[]>;
  getID(_id: string): Promise<U>;
  search(query: { key: string; value: unknown }): Promise<U[]>;
  create(_info: Partial<U>): Promise<U>;
  update(_info: Partial<U>): Promise<U>;
  delete(_id: string): Promise<void>;
}