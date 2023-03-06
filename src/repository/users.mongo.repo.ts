import { User } from '../entities/user.js';
import { Repo } from './repo.interface.js';
import createDebug from 'debug';
import { UserModel } from './user.mongo.model.js';
import { HTTPError } from '../errors/errors.js';

const debug = createDebug('W6: ');

export class UserMongoRepo implements Repo<User> {
  private static instanced: UserMongoRepo;

  public static getInstance(): UserMongoRepo {
    if (!UserMongoRepo.instanced) {
      UserMongoRepo.instanced = new UserMongoRepo();
    }

    return UserMongoRepo.instanced;
  }

  private constructor() {
    debug('Instantiate');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find();
    return data;
  }

  async getID(id: string): Promise<User> {
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in ReadID ');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(402, 'Not possible', 'Update was not possible');
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(402, 'Not possible', 'Delete was not possible');
  }
}
