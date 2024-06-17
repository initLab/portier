import { listUserAccessibleDevices } from '../../device/index.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:getLights');

export function getLights(req, res) {
    debug('Successful');
    res.json(listUserAccessibleDevices(req.user, 'light'));
}
