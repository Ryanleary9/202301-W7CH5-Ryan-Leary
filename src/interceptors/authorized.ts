import { NextFunction } from 'express';
import { RequestPlus } from './logged';

import { HTTPError } from '../errors/errors.js';
import createDebug from 'debug';
import { UserMongoRepo } from '../repository/users.mongo.repo';

const debug = createDebug('W6: interceptors:authorized');

export async function authorized(
  req: RequestPlus,
  next: NextFunction,
  friends: UserMongoRepo
) {
  try {
    debug('Called');

    if (!req.info)
      throw new HTTPError(
        498,
        'Token not found',
        'Token not found in authorized interceptor'
      );
    // Tengo el ID de usuario (req.info)
    const userID = req.info?.id;

    // Tengo el ID del Oso (req.params.id)
    const bearID = req.params.id;

    // Busco la cosa
    debug(bearID);
    const friend = await friends.getID(bearID);

    // Comparo bears.owner.id con req.info.id

    if (friend.id !== userID)
      throw new HTTPError(401, 'Not authorized', 'Not authorized');
    next();
  } catch (error) {
    next(error);
  }

  //
}
