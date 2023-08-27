import { config } from '../../config.js';
import { isAuthorised } from '../../user.js';
import { getController } from '../../doorController/index.js';

export function executeDoorAction(req, res) {
    if (!req.user) {
        return res.status(403).end();
    }

    const {
        doorId,
        action,
    } = req.params;

    const doors = config.doors;

    if (!doors.hasOwnProperty(doorId)) {
        return res.status(404).end();
    }

    const door = doors[doorId];

    if (!door.actions.hasOwnProperty(action)) {
        return res.status(404).end();
    }

    const actionConditions = door.actions[action];

    if (actionConditions.hasOwnProperty('roles') && !isAuthorised(req.user.roles, actionConditions.roles)) {
        return res.status(403).end();
    }

    // user is authorized to perform action
    const controller = getController(doorId);
    controller.executeAction(action);
    res.status(204).end();
}
