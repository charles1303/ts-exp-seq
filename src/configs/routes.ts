import { Application } from 'express';
import { UserRoutes } from './routes/userRoutes';

export default function (app: Application) {

  new UserRoutes(app);

}
