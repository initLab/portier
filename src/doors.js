import { config } from './config.js';
import { isAuthorised } from './user.js';
import { createDebug } from './debug.js';
import { addEventListener } from './mqtt/index.js';
import { getController } from './doorController/index.js';

const debug = createDebug('doors');

const statuses = {};
const subscriptions = {};

export function init() {
    for (const door of config.doors) {
        const controller = getController(door.id);
        // TODO
    }

    if (Object.keys(subscriptions).length > 0) {
        addEventListener('message', () => {});
    }
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
    name: door.name[user.locale],
    supported_actions: Object.entries(door.actions).filter(([_, actionOptions]) =>
        isAuthorised(user.roles, actionOptions.roles)
    ).map(([action]) => action),
})).filter(door => door.supported_actions.length > 0);
