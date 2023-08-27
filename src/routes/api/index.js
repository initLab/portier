import Router, { json } from 'express';
import { getDoors } from './getDoors.js';
import cors from 'cors';
import { wrap } from '../../middleware/asyncMiddleware.js';
import { auth } from '../../middleware/auth.js';
import { executeDoorAction } from './executeDoorAction.js';

export const apiRouter = new Router();

apiRouter.use(json());
apiRouter.use(cors());
apiRouter.use(wrap(auth()));

apiRouter.get('/doors', getDoors);
apiRouter.post('/doors/:doorId/:action', executeDoorAction);
