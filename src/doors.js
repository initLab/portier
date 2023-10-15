import { config } from './config.js';
import { isAuthorized } from './user.js';
import { NotFoundError } from './errors.js';

export function getDoor(doorId) {
    const door = config.doors.filter(door => door.id === doorId)?.[0];

    if (!door) {
        throw new NotFoundError('Door ' + doorId + ' not found in config');
    }

    return door;
}

export const listUserAccessibleDoors = user => config.doors.map(door => ({
    id: door.id,
    name: door.name?.[user.locale],
    number: door.number || 0,
    supported_actions: Object.entries(door.actions || []).filter(([_, actionConditions]) =>
        isAuthorized(user, actionConditions)
    ).map(([action]) => action),
})).filter(door => door.supported_actions.length > 0);
