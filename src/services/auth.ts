import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HTTPError } from '../errors/errors.js';
import bcrypt from 'bcryptjs';

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: PayloadToken) {
    return jwt.sign(payload, config.jwtSecret as string);
  }

  static getTokenPayload(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string')
      throw new HTTPError(418, 'invalid payload', result);
    return result as PayloadToken;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
