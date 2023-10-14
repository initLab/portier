import { isAuthorized } from '../../user.js';
import { getController } from '../../doorController/index.js';
import { sendNotification } from '../../mqtt/notification.js';
import { InvalidConfigurationError, NotFoundError } from '../../errors.js';
import { getDoor } from '../../doors.js';
import { logDoorAction } from '../../database/actionLogger.js';
import { createDebug } from '../../debug.js';

const debug = createDebug('executeDoorAction');

export async function executeDoorAction(req, res) {
    if (!req.user || !req.tokenInfo.scope.includes('door_control')) {
        debug('Unauthenticated');
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
            debug('Door not found', doorId);
            return res.status(404).end();
        }

        throw err;
    }

    let controller;

    try {
        controller = getController(door);
    }
    catch (err) {
        if (err instanceof InvalidConfigurationError) {
            debug('Controller not found');
            return res.status(500).end();
        }

        throw err;
    }

    if (!isAuthorized(req.user, door.actions?.[action])) {
        debug('Unauthorized');
        return res.status(403).end();
    }

    // user is authorized to perform action
    try {
        await controller.executeAction(action);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            debug('Action not found');
            return res.status(404).end();
        }
        if (err instanceof InvalidConfigurationError) {
            debug('Invalid actions configuration');
            return res.status(500).end();
        }

        throw err;
    }

    debug('Action', action, 'on door', door.id, 'successful');

    await logDoorAction(req, door, action);
    await sendNotification(req, door, action);

    res.status(204).end();
}
