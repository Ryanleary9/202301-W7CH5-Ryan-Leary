import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user.js';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { RequestPlus } from '../interceptors/logged.js';

const debug = createDebug('W6:controller');

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getID(req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.repo.getID(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      const userID = req.info?.id;
      if (!userID) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repo.getID(userID); // Throw error if not found

      req.body.owner = userID;

      const newFriend = await this.repo.create(req.body);

      // Opcion bidirecionalidad

      actualUser.friends.push(newFriend);
      this.repo.update(actualUser);

      resp.json({
        results: [newFriend],
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    try {
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repo.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Updating profile...');
      if (!req.info?.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const member = await this.repo.getID(req.info.id);
      req.body.id = member.id;
      const updatedMember = await this.repo.update(req.body);
      debug('Profile updated!');
      res.json({ results: [updatedMember] });
    } catch (error) {
      next(error);
    }
  }

  async addRelation(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('add relation');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repo.getID(userId);
      const data = await this.repo.getID(req.params.id);
      if (!data) throw new HTTPError(404, 'Not found', 'Not found user id');

      // Determine whether to add as friend or enemy
      const { relation } = req.body;
      if (relation === 'friend') {
        actualUser.friends.push(data);
      } else if (relation === 'enemy') {
        actualUser.enemies.push(data);
      } else {
        throw new HTTPError(400, 'Bad request', 'Invalid relation specified');
      }

      this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRelation(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('remove relation');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repo.getID(userId);
      const data = await this.repo.getID(req.params.id);
      if (!data) throw new HTTPError(404, 'Not found', 'Not found user id');

      // Determine whether to remove from friends or enemies
      const { relation } = req.body;
      if (relation === 'friend') {
        actualUser.friends = actualUser.friends.filter(
          (friend) => friend.id !== data.id
        );
      } else if (relation === 'enemy') {
        actualUser.enemies = actualUser.enemies.filter(
          (enemy) => enemy.id !== data.id
        );
      } else {
        throw new HTTPError(400, 'Bad request', 'Invalid relation specified');
      }

      this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
