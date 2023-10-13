import { isAuthorized } from '../../user.js';
import { getController } from '../../doorController/index.js';
import { sendNotification } from '../../mqtt/notification.js';
import { InvalidInputError, NotFoundError } from '../../errors.js';
import { getDoor } from '../../doors.js';

export async function executeDoorAction(req, res) {
    if (!req.user || !req.tokenInfo.scope.includes('door_control')) {
        return res.status(403).end();
    }

    const {
        doorId,
        action,
    } = req.params;

    let door;

    try {
        door = getDoor(doorId);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).end();
        }

        throw err;
    }

    let controller;

    try {
        controller = getController(door);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).end();
        }

        throw err;
    }

    if (!isAuthorized(req.user, door.actions?.[action])) {
        return res.status(403).end();
    }

    // user is authorized to perform action
    try {
        await controller.executeAction(action);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).end();
        }
        if (err instanceof InvalidInputError) {
            return res.status(400).end();
        }

        throw err;
    }

    await sendNotification(req, door, action);
    res.status(204).end();
}
