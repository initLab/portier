import { config } from '../config.js';
import { isAuthorized } from '../user.js';
import { NotFoundError } from '../errors.js';
import { getDeviceStatuses } from '../status/index.js';

const matchDeviceGroup = (device, deviceGroup) => !deviceGroup || device.group === deviceGroup;

export function getDevice(deviceId, deviceGroup) {
    const device = config.devices.filter(device => device.id === deviceId && matchDeviceGroup(device, deviceGroup))?.[0];

    if (!device) {
        throw new NotFoundError('Device ' + deviceId + ' not found in config');
    }

    return device;
}

export const listUserAccessibleDevices = (user, deviceGroup) => config.devices.map(device => ({
    id: device.id,
    name: device.name?.[user.locale],
    type: device?.type ?? 'unknown',
    group: device?.group ?? 'unknown',
    number: device?.number ?? 0,
    public: !!device.public,
    supported_actions: Object.entries(device?.actions ?? []).filter(([, actionConditions]) =>
        isAuthorized(user, actionConditions)
    ).map(([action]) => action),
})).filter(device => device.supported_actions.length > 0 && matchDeviceGroup(device, deviceGroup)).map(device => ({
    ...device,
    statuses: getDeviceStatuses(device.id),
}));
