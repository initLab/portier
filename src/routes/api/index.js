import Router, { json } from 'express';
import { getDoors } from './doors.js';
import cors from 'cors';

export const apiRouter = new Router();

apiRouter.use(json());
apiRouter.use(cors());

apiRouter.get('/doors', getDoors);
