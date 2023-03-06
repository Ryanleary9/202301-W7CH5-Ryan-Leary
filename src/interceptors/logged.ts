import { Response, Request, NextFunction } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';

export interface RequestPlus extends Request {
  info?: PayloadToken;
}

export function loged(req: RequestPlus, resp: Response, next: NextFunction) {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw new HTTPError(498, 'Invalid Token', 'Invalid Token');
    if (!authHeader.startsWith('Bearer'))
      throw new HTTPError(498, 'Invalid Token', 'Not bearer in auth header');
    const token = authHeader.slice(7);
    const payload = Auth.getTokenPayload(token);
    req.info = payload;
    next();
  } catch (error) {
    next(error);
  }

  //
}
