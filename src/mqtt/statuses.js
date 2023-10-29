import { config } from '../config.js';
import { InvalidConfigurationError } from '../errors.js';
import { addTopicHandler, subscribe } from './index.js';
import { createDebug } from '../debug.js';
import { pubsub } from '../pubsub/index.js';

const debug = createDebug('mqtt:statuses');
const statusChangedEventName = 'statusChanged';
const statuses = {};

export function init() {
    config.devices.forEach(function (device) {
        const statusConfig = device?.statuses || {};
        const deviceId = device.id;

        Object.entries(statusConfig).forEach(function ([key, options]) {
            const fullKey = deviceId + '/' + key;
            const inputConfig = options?.input;
            const outputConfig = options?.output;

            switch (options?.type) {
                case 'mqtt':
                    const topic = inputConfig?.topic;

                    if (typeof topic === 'undefined') {
                        throw new InvalidConfigurationError('No topic provided for key ' + fullKey);
                    }

                    const inputType = inputConfig?.type;

                    if (!['literal', 'json'].includes(inputType)) {
                        throw new InvalidConfigurationError('Invalid input type for key ' + fullKey + ': ' +
                            inputType);
                    }

                    const outputType = outputConfig?.type;

                    if (!['boolean', 'string'].includes(outputType)) {
                        throw new InvalidConfigurationError('Invalid output type for key ' + fullKey + ': ' +
                            outputType);
                    }

                    if (outputType === 'boolean') {
                        const valueTrue = outputConfig?.valueTrue;

                        if (typeof valueTrue === 'undefined') {
                            throw new InvalidConfigurationError('No valueTrue provided for key ' + fullKey);
                        }

                        const valueFalse = outputConfig?.valueFalse;

                        if (typeof valueFalse === 'undefined') {
                            throw new InvalidConfigurationError('No valueFalse provided for key ' + fullKey);
                        }
                    }

                    addTopicHandler(topic, function(rawValue) {
                        const parsedValue = parseValue(rawValue, inputConfig);
                        const mappedValue = mapValue(parsedValue, outputConfig);
                        setStatusValue(deviceId, key, mappedValue);
                    });

                    subscribe(topic);
                    break;
                case 'lock':
                    const statusLocked = inputConfig?.statusLocked;

                    if (typeof statusLocked === 'undefined') {
                        throw new InvalidConfigurationError('No statusLocked provided for key ' + fullKey);
                    }

                    const statusUnlocked = inputConfig?.statusUnlocked;

                    if (typeof statusUnlocked === 'undefined') {
                        throw new InvalidConfigurationError('No statusUnlocked provided for key ' + fullKey);
                    }

                    pubsub.on(statusChangedEventName, function({
                        deviceId: eventDeviceId,
                        key: eventKey,
                        oldValue,
                    }) {
                        if (eventDeviceId !== deviceId || ![statusLocked, statusUnlocked].includes(eventKey)) {
                            return;
                        }

                        const isLocked = getStatusValue(deviceId, statusLocked);
                        const isUnlocked = getStatusValue(deviceId, statusUnlocked);
                        const didLockedStatusChange = eventKey === statusLocked;
                        const calculatedValue = calculateLockStatus(
                            isLocked, isUnlocked, oldValue, didLockedStatusChange
                        );

                        if (typeof calculatedValue === 'string') {
                            setStatusValue(deviceId, key, calculatedValue);
                        }
                    });
                    break;
            }

            setStatusValue(deviceId, key);
        });
    });
}

function parseValue(value, inputConfig) {
    switch (inputConfig?.type) {
        case 'literal':
            return value;
        case 'json':
            if (!inputConfig.hasOwnProperty('jsonPath')) {
                return null;
            }

            const decoded = JSON.parse(value);
            let path = inputConfig.jsonPath.split('.');
            let result = decoded;

            while (path.length > 0) {
                result = result?.[path.shift()];
            }

            return result;
        default:
            return null;
    }
}

function mapValue(value, outputConfig) {
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

function calculateLockStatus(isLocked, isUnlocked, oldValue, didLockedStatusChange) {
    if (typeof isLocked !== 'boolean' || typeof isUnlocked !== 'boolean') {
        return 'unknown';
    }

    if (isLocked && isUnlocked) {
        return 'invalid';
    }

    if (isLocked && !isUnlocked) {
        return 'locked';
    }

    if (!isLocked && isUnlocked) {
        return 'unlocked';
    }

    if (oldValue !== true) {
        // repeated calling with no actual change
        return null;
    }

    return didLockedStatusChange ? 'unlocking' : 'locking';
}

export function getDeviceStatuses(deviceId) {
    return statuses?.[deviceId] || {};
}

function getStatusValue(deviceId, key) {
    return statuses?.[deviceId]?.[key];
}

function setStatusValue(deviceId, key, value = null) {
    const fullKey = deviceId + '.' + key;

    if (!statuses.hasOwnProperty(deviceId)) {
        statuses[deviceId] = {};
    }

    const oldValue = getStatusValue(deviceId, key);

    if (value === oldValue) {
        debug('Skipping', fullKey, 'because it\s already set to', oldValue);
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
}
