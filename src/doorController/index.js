import { config } from '../config.js';
import { getMqttController } from './mqtt.js';

export function getController(doorId) {
    const door = config.doors?.[doorId];

    if (!door) {
        throw new Error('Door ' + doorId + ' not found');
    }

    const controller = door?.controller;

    if (!controller) {
        throw new Error('No controller configured for door ' + doorId);
    }

    switch (controller?.type) {
        case 'mqtt':
            return getMqttController(controller?.options || {});
        default:
            throw new Error('Unknown controller type ' + controller?.type + ' for door ' + doorId);
    }
}
