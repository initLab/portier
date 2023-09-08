import { getMqttController } from './mqtt.js';
import { InvalidConfigurationError } from '../errors.js';

export function getController(door) {
    const controller = door.controller;

    if (!controller) {
        throw new InvalidConfigurationError('No controller configured for door ' + door.id);
    }

    switch (controller?.type) {
        case 'mqtt':
            return getMqttController(controller?.options || {});
        default:
            throw new InvalidConfigurationError('Unknown controller type ' + controller?.type + ' for door ' + door.id);
    }
}
