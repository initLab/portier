import Router from 'express';
import { getDoors } from './doors.js';

export const apiRouter = new Router();

apiRouter.get('/doors', getDoors);
