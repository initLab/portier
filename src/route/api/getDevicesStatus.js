import { createDebug } from '../../util/debug.js';
import { config } from '../../config.js';
import { getDeviceStatuses } from '../../status/index.js';

const debug = createDebug('route:api:getDeviceStatuses');

export function getDevicesStatus(req, res) {
    debug('Successful');
    res.json(config.devices.map(device => ({
        id: device.id,
        statuses: getDeviceStatuses(device.id),
    })).filter(device =>
        Object.keys(device.statuses).length > 0
    ));
}
