import { UserModel } from './user.mongo.model';
import { UserMongoRepo } from './users.mongo.repo';

jest.mock('./user.mongo.model');

describe('Given BearMongoRepo', () => {
  const repo = UserMongoRepo.getInstance();
  describe('When is called', () => {
    test('Then should be instanced', () => {
      expect(repo).toBeInstanceOf(UserMongoRepo);
    });
  });

  describe('When i use readAll', () => {
    test('Then should return the data', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.getAll();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When i use ReadId', () => {
    test('Then should return the data', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });

      const id = '1';
      const result = await repo.getID(id);
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findById as jest.Mock).mockResolvedValue(undefined);
      // Act
      const mockUser = '1';
      // Assert
      expect(async () => repo.getID(mockUser)).rejects.toThrow();
      expect(UserModel.findById).toHaveBeenCalled();
    });
  });

  describe('When i use search', () => {
    test('Then it should return what i serched for', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([
        {
          key: 'some',
          value: 'oso',
        },
      ]);

      const result = await repo.search({ key: 'some', value: 'oso' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          key: 'some',
          value: 'oso',
        },
      ]);
    });
  });

  describe('When i use create', () => {
    test('Then it should return an object if we give a valid id', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue([
        {
          email: 'asdadmas2@eas.es',
          passwd: 'asdlasda',
        },
      ]);
      const newUser = {
        email: 'asdadmas2@eas.es',
        passwd: 'asdlasda',
      };
      const result = await repo.create(newUser);
      expect(result).toStrictEqual([newUser]);
    });
  });

  describe('When i use update', () => {
    test('Then it should return the updated object if it has the same id', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        email: 'asdadmas2@eas.es',
        passwd: 'asdlasda',
      });
      const result = await repo.update({
        email: 'asdadmas2@eas.es',
        passwd: 'asdlasda',
      });
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toStrictEqual({
        email: 'asdadmas2@eas.es',
        passwd: 'asdlasda',
      });
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      // Act
      const mockUser = { id: '1', name: 'Pedro' };
      // Assert
      expect(async () => repo.update(mockUser)).rejects.toThrow();
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
      // Act

      // Assert
      expect(async () => repo.delete('1')).rejects.toThrow();
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
