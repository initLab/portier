import { listUserAccessibleDevices } from '../../devices.js';
import { createDebug } from '../../debug.js';

const debug = createDebug('getDevices');

export function getDevices(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    debug('Successful');
    res.json(listUserAccessibleDevices(req.user));
}
