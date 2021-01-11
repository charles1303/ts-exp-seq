import * as express from 'express';
import * as dotenvflow from "dotenv-flow";
dotenvflow.config();

import logger from './utils/logger';

const app = express();
/**
 * Setup listener port
 */
if (process.env.NODE_ENV !== 'test') {
  
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Running Node.js version ${process.version}`);
      logger.info(`App environment: ${process.env.NODE_ENV}`);
      logger.info(`App is running on port ${PORT}`);
    });
}


export default app;
