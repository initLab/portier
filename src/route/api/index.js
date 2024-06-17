import Router, { json } from 'express';
import { getDoors } from './getDoors.js';
import cors from 'cors';
import { executeDeviceAction } from './executeDeviceAction.js';
import { executeDoorAction } from './executeDoorAction.js';
import { getActionLog } from './getActionLog.js';
import { getLights } from './getLights.js';
import { getDevices } from './getDevices.js';
import { middleware as passportMiddleware } from '../../passport.js';

export const apiRouter = new Router();

apiRouter.use(cors());
apiRouter.use(passportMiddleware());
apiRouter.use(json());

apiRouter.get('/devices', getDevices);
apiRouter.get('/doors', getDoors);
apiRouter.get('/lights', getLights);

apiRouter.post('/device/:deviceId/:action', executeDeviceAction);

// backwards compatibility
apiRouter.post('/doors/:doorId/:action', executeDoorAction);

apiRouter.get('/actionLog/:offset/:limit', getActionLog);

