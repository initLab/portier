import { listUserAccessibleDevices } from '../../device/index.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:getDevices');

export function getDevices(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    debug('Successful');
    res.json(listUserAccessibleDevices(req.user));
}
