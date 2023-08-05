import express from 'express';
import { createDebug } from './src/debug.js';

const debug = createDebug('express');
export const app = express();

app.get('/', (req, res) => {
    debug('request');
    res.send('Hello World!');
});
