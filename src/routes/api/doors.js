import { listUserAccessibleDoors } from '../../doors.js';

export function getDoors(req, res) {
    if (!req.user) {
        return res.status(403).end();
    }

    res.json(listUserAccessibleDoors(req.user));
}
