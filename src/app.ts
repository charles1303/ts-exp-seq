import { install as installSourceMapSupport } from 'source-map-support';
installSourceMapSupport();
import 'reflect-metadata';
import * as express from 'express';
import * as compress from 'compression';
import app from './server';
import * as cors from 'cors';
import routes from './configs/routes';
import errorHandler from './errors/error.handler';
import logger from './utils/logger';
import container from '../src/configs/inversify';
import { AuthController } from './controllers/auth.controller';

const authControllerInstance = container.get<AuthController>(AuthController);

/**
 * This is a bootstrap function
 */
async function bootstrap() {
  // Attach HTTP request info logger middleware in test mode
  if (process.env.NODE_ENV === 'test') {
    app.use((req: express.Request, _res, next) => {
      logger.debug(`[${req.method}] ${req.hostname}${req.url}`);

      next();
    });
  }

  app.disable('x-powered-by'); // Hide information
  app.use(compress()); // Compress

  // Enable middleware/whatever only in Production
  if (process.env.NODE_ENV === 'production') {
    // For example: Enable sentry in production
    // app.use(Sentry.Handlers.requestHandler());
  }

  /**
   * Configure cors
   */
  app.use(cors());

  /**
   * Configure body parser
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Host static public directory
   */
  app.use('/', express.static('public'));

  /**
   * Configure secured routes
   */

  app.use(authControllerInstance.initialize());
  
  app.all( "*", (req, res, next) => {
    if (req.path.includes("login") || req.path.includes("register")) {
      return next();
    } 

    return authControllerInstance.authenticate((err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            if (info.name === "TokenExpiredError") {
                return res.status(401).json({ status: "error", data: "Your token has expired. Please generate a new one" });
            } else {
                return res.status(401).json({ status: "error", data: info.message });
            }
        }
        app.set("user", user);
        return next();
    })(req, res, next);
});


  /**
   * Configure routes
   */
  routes(app);

  /**
   * Configure error handler
   */
  errorHandler(app);
}

// Need for integration testing
export default app;

// Invoking the bootstrap function
bootstrap()
  .then(() => {
    logger.info('Server is up');
  })
  .catch((error) => {
    logger.error('Unknown error. ' + error.message);
  });
