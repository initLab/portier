import { listUserAccessibleDevices } from '../../device/index.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:getDoors');

export function getDoors(req, res) {
    debug('Successful');
    res.json(listUserAccessibleDevices(req.user, 'door'));
}
