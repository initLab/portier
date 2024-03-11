import express from 'express';
import { apiRouter } from './route/api/index.js';
import { register as promRegister } from 'prom-client';

export const app = express();

app.use('/api', apiRouter);

app.get('/metrics', async function(req, res) {
    try {
        res.set('Content-Type', promRegister.contentType);
        res.end(await promRegister.metrics());
    } catch (ex) {
        res.status(500).end(ex.toString());
    }
});
