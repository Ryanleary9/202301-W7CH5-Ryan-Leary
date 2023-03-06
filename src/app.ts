import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Response, Request } from 'express';
import morgan from 'morgan';
import { CustomError } from './errors/errors';
import { userRouter } from './router/user.router.js';

const debug = createDebug('W6:app');

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userRouter);

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
