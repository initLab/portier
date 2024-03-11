import { collectDefaultMetrics, Gauge } from 'prom-client';
import { createDebug } from '../util/debug.js';
import { timings } from '../status/lock.js';

const debug = createDebug('prometheus');

export function init() {
    collectDefaultMetrics();
    debug('Initialized default metrics');

    const prefix = 'portier_';

    new Gauge({
        name: prefix + 'state_change_duration_seconds',
        help: 'Duration of the last locking or unlocking event',
        labelNames: [
            'deviceId',
            'action',
        ],
        async collect() {
            timings.forEach(timing => {
                if (!timing.ready) {
                    return;
                }

                this.set({
                    deviceId: timing.deviceId,
                    action: timing.action,
                }, (timing.end.getTime() - timing.start.getTime()) / 1000);
            });
        },
    });

    debug('Initialized custom metrics');
}
