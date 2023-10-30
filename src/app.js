import express from 'express';
import { apiRouter } from './route/api/index.js';

export const app = express();

app.use('/api', apiRouter);
