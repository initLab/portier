import { config } from './config.js';
import { isAuthorized } from './user.js';
import { NotFoundError } from './errors.js';

const matchDeviceType = (device, deviceType) => !deviceType || device.type === deviceType;

export function getDevice(deviceId, deviceType) {
    const device = config.devices.filter(device => device.id === deviceId && matchDeviceType(device, deviceType))?.[0];

    if (!device) {
        throw new NotFoundError('Device ' + deviceId + ' not found in config');
    }

    return device;
}

export const listUserAccessibleDevices = (user, deviceType) => config.devices.map(device => ({
    id: device.id,
    name: device.name?.[user.locale],
    type: device.type || 'unknown',
    number: device.number || 0,
    supported_actions: Object.entries(device.actions || []).filter(([_, actionConditions]) =>
        isAuthorized(user, actionConditions)
    ).map(([action]) => action),
})).filter(device => device.supported_actions.length > 0 && matchDeviceType(device, deviceType));
