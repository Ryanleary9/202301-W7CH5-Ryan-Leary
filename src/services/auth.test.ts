import { Auth } from './auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../config.js', () => ({
  __dirname: 'testdir',
  config: {
    jwtSecret: 'a',
  },
}));
describe('Given auth component', () => {
  describe('When i use the createJwt function', () => {
    test('Then it should sign the token', () => {
      const tokenPayload = {
        id: '1',
        email: 'asdas.es',
        role: 'user',
      };

      Auth.createJWT(tokenPayload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
  describe('WHen we call for the token payload', () => {
    describe('When a secret is not provided', () => {
      test('Then it should throw an HTTPError', () => {
        (jwt.verify as jest.Mock).mockReturnValue('string');
        expect(() => Auth.getTokenPayload('')).toThrow();
      });
    });
  });

  describe('When the hash method is called', () => {
    test('should first', () => {
      Auth.hash('test');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When the compare method is called', () => {
    test('Then, it shold return the mock value of bcrypt.compare and have been called', () => {
      Auth.compare('test', 'testHash');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
