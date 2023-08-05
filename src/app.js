import express from 'express';
import { createDebug } from './debug.js';
import { apiRouter } from './routes/api/index.js';

const debug = createDebug('express');
export const app = express();

app.get('/', (req, res) => {
    debug('request');
    res.send('Hello World!');
});

app.use('/api', apiRouter);
