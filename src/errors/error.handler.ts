import { Application, Request, Response, NextFunction } from 'express';
import { NotFoundError, ApplicationError } from './app.errors';
import log from '../utils/logger';

export default function (app: Application) {

  /**
   * Handle errors
   */

  // If you are lost
  app.use(() => {
    throw new NotFoundError('You are lost');
  });

  // Request error handler
  app.use((err: ApplicationError, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApplicationError) {
      if (err.message) {
        log.info(err.message);
        return res.status(err.code).send({status: "error", data: err.message});
      } else {
        return res.sendStatus(err.code).send({status: "error", data: "Error occured"});
      }
    }

    next(err);
  });

  // Log all errors
  app.use(function (err: any, req: Request, _res: Response, next: NextFunction) {
    const userString = 'unknown user';

    if (err instanceof Error) {
      log.error(`${req.method} ${req.path}: Unhandled request error ${userString}. ${err.message}`);
    } else if (typeof err === 'string') {
      log.error(`${req.method} ${req.path}: Unhandled request error ${userString}. ${err}`);
    }

    next(err);
  });

  // Optional fallthrough error handler
  app.use(function onError(err: Error, _req: Request, res: Response, _next: NextFunction) {
    res.status(500).send({status: "error", data: err.message});
  });
}
