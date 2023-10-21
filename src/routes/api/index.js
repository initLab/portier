import Router, { json } from 'express';
import { getDoors } from './getDoors.js';
import cors from 'cors';
import { wrap } from '../../middleware/asyncMiddleware.js';
import { auth } from '../../middleware/auth.js';
import { executeDeviceAction } from './executeDeviceAction.js';
import { executeDoorAction } from './executeDoorAction.js';
import { getActionLog } from './getActionLog.js';

export const apiRouter = new Router();

apiRouter.use(json());
apiRouter.use(cors());
apiRouter.use(wrap(auth()));

apiRouter.get('/doors', getDoors);
apiRouter.post('/doors/:doorId/:action', executeDoorAction); // backwards compatibility
apiRouter.post('/device/:deviceId/:action', executeDeviceAction);

apiRouter.get('/actionLog/:offset/:limit', getActionLog);
