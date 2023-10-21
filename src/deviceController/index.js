import { getMqttController } from './mqtt.js';
import { InvalidConfigurationError } from '../errors.js';

export function getController(device) {
    const controller = device.controller;

    if (!controller) {
        throw new InvalidConfigurationError('No controller configured for device ' + device.id);
    }

    switch (controller?.type) {
        case 'mqtt':
            return getMqttController(controller?.options || {});
        default:
            throw new InvalidConfigurationError('Unknown controller type ' + controller?.type + ' for device ' + device.id);
    }
}
