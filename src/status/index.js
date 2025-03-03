import { config } from '../config.js';
import { InvalidConfigurationError } from '../errors.js';
import { createDebug } from '../util/debug.js';
import { pubsub } from '../pubsub/index.js';
import { initStatus as initMqttStatus } from './mqtt.js';
import { initStatus as initLockStatus } from './lock.js';
import { sendNotification } from './notification.js';
import { getJsonPath } from '../util/json.js';

const debug = createDebug('status');
export const statusChangedEventName = 'statusChanged';
const statuses = {};

export function init() {
    config.devices.forEach(function (device) {
        const statusConfig = device?.statuses ?? {};
        const deviceId = device.id;

        Object.entries(statusConfig).forEach(function ([key, options]) {
            const statusType = options?.type;

            switch (statusType) {
                case 'mqtt':
                    initMqttStatus(deviceId, key, options);
                    break;
                case 'lock':
                    initLockStatus(deviceId, key, options);
                    break;
                default:
                    throw new InvalidConfigurationError('Unknown status type: ' + statusType);
            }

            // initialize to null on startup
            setStatusValue(deviceId, key);
        });
    });
}

export function parseValue(value, inputConfig) {
    switch (inputConfig?.type) {
        case 'literal':
            return value;
        case 'json':
            if (!Object.hasOwn(inputConfig, 'jsonPath')) {
                return null;
            }

            return getJsonPath(value, inputConfig.jsonPath);
        default:
            return null;
    }
}

export function mapValue(value, outputConfig) {
    switch (outputConfig?.type) {
        case 'string':
            return value;
        case 'boolean':
            if (value === outputConfig?.valueTrue) {
                return true;
            }

            if (value === outputConfig?.valueFalse) {
                return false;
            }

            return null;
        default:
            return null;
    }
}

export function getDeviceStatuses(deviceId) {
    return statuses?.[deviceId] ?? {};
}

export function getStatusValue(deviceId, key) {
    return statuses?.[deviceId]?.[key];
}

export function mapAndSetValue(deviceId, key, value, outputConfig) {
    const mappedValue = mapValue(value, outputConfig);

    if (mappedValue === null) {
        return;
    }

    setStatusValue(deviceId, key, mappedValue);
}

function setStatusValue(deviceId, key, value = null) {
    const fullKey = deviceId + '.' + key;

    if (!Object.hasOwn(statuses, deviceId)) {
        statuses[deviceId] = {};
    }

    const oldValue = getStatusValue(deviceId, key);

    if (value === oldValue) {
        debug('Skipping', fullKey, 'because it\'s already set to', oldValue);
        return;
    }

    statuses[deviceId][key] = value;

    debug('Set', fullKey, 'to', value);

    pubsub.emit(statusChangedEventName, {
        deviceId,
        key,
        value,
        oldValue,
    });

    sendNotification(deviceId, key, value, oldValue);
}
