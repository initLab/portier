import Router, { json } from 'express';
import { getDoors } from './doors.js';
import cors from 'cors';
import { wrap } from '../../middleware/asyncMiddleware.js';
import { auth } from '../../middleware/auth.js';

export const apiRouter = new Router();

apiRouter.use(json());
apiRouter.use(cors());
apiRouter.use(wrap(auth()));

apiRouter.get('/doors', getDoors);
