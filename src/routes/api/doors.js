import { listUserAccessibleDoors } from '../../doors.js';
import { getUser } from '../../user.js';

export function getDoors(req, res) {
    const user = getUser();

    if (!user) {
        return res.status(401).end();
    }

    res.json(listUserAccessibleDoors(user));
}
