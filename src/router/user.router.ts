import { Router } from 'express';
import { UserMongoRepo } from '../repository/users.mongo.repo';
import { UserController } from '../controllers/users.controller';
import { loged } from '../interceptors/logged';

// eslint-disable-next-line new-cap
export const userRouter = Router();

const userRepo = UserMongoRepo.getInstance();
const controller = new UserController(userRepo);

userRouter.get('/', loged, controller.getAll.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/add¿relation/:id',
  loged,
  controller.addRelation.bind(controller)
);
userRouter.patch(
  '/delete¿relation/:id',
  loged,
  controller.removeRelation.bind(controller)
);
