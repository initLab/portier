import { listUserAccessibleDevices } from '../../devices.js';
import { createDebug } from '../../debug.js';

const debug = createDebug('getLights');

export function getLights(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    debug('Successful');
    res.json(listUserAccessibleDevices(req.user, 'light'));
}
