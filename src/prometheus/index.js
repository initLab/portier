import { collectDefaultMetrics, Gauge } from 'prom-client';
import { createDebug } from '../util/debug.js';

const debug = createDebug('prometheus');

export function init() {
    collectDefaultMetrics();
    debug('Initialized default metrics');
}
