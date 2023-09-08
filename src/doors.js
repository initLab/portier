import { config } from './config.js';
import { isAuthorized } from './user.js';
import { createDebug } from './debug.js';
import { addEventListener } from './mqtt/index.js';
import { getController } from './doorController/index.js';
import { NotFoundError } from './errors.js';

const debug = createDebug('doors');

const statuses = {};
const subscriptions = {};

export function init() {
    for (const door of config.doors) {
        const controller = getController(door);
        // TODO
    }

    if (Object.keys(subscriptions).length > 0) {
        addEventListener('message', () => {});
    }
}

export function getDoor(doorId) {
    const door = config.doors.filter(door => door.id === doorId)?.[0];

    if (!door) {
        throw new NotFoundError('Door ' + doorId + ' not found in config');
    }

    return door;
}

function getStatuses() {
    return statuses;
}

function getStatus(doorId, statusId) {
    return statuses?.[doorId]?.[statusId];
}

function setStatus(doorId, statusId, value) {
    if (!statuses.hasOwnProperty(doorId)) {
        statuses[doorId] = {};
    }

    statuses[doorId][statusId] = value;
}

export const listUserAccessibleDoors = user => config.doors.map(door => ({
    id: door.id,
    name: door.name?.[user.locale],
    number: door.number || 0,
    supported_actions: Object.entries(door.actions || []).filter(([_, actionConditions]) =>
        isAuthorized(user, actionConditions)
    ).map(([action]) => action),
})).filter(door => door.supported_actions.length > 0);
