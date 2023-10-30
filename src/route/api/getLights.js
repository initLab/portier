import { listUserAccessibleDevices } from '../../device/index.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:getLights');

export function getLights(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    debug('Successful');
    res.json(listUserAccessibleDevices(req.user, 'light'));
}
