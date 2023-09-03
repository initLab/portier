import { config } from './config.js';
import { isAuthorised } from './user.js';
import { createDebug } from './debug.js';
import { addEventListener } from './mqtt/index.js';

const debug = createDebug('doors');

export const statuses = {};
const subscriptions = {};

export function init() {
    for (const door of config.doors) {
        switch (door?.controller?.type) {
            case 'mqtt':
                setupMqttController(door.id, door.controller.options || {});
                break;
            case undefined:
                debug('No controller provided for door', door.id);
                break;
            default:
                throw new Error('Unknown controller type for door ' + door.id + ': ' + door.controller.type);
        }
    }

    if (Object.keys(subscriptions).length > 0) {
        addEventListener('message', handleMessage);
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

function setupMqttController(doorId, options) {

}

function handleMessage(topic, payload, packet) {

}

export const listUserAccessibleDoors = user => config.doors.map(door => ({
    id: door.id,
    name: door.name[user.locale],
    supported_actions: Object.entries(door.actions).filter(([_, actionOptions]) =>
        isAuthorised(user.roles, actionOptions.roles)
    ).map(([action]) => action),
})).filter(door => door.supported_actions.length > 0);
