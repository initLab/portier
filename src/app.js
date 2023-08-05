import express from 'express';
import { apiRouter } from './routes/api/index.js';

export const app = express();

app.use('/api', apiRouter);
