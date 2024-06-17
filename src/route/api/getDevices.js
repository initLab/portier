import { listUserAccessibleDevices } from '../../device/index.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:getDevices');

export function getDevices(req, res) {
    debug('Successful');
    res.json(listUserAccessibleDevices(req.user));
}
