import { listUserAccessibleDoors } from '../../doors.js';
import { createDebug } from '../../debug.js';

const debug = createDebug('getDoors');

export function getDoors(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    debug('Successful');
    res.json(listUserAccessibleDoors(req.user));
}
