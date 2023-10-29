import { config } from '../config.js';
import { InvalidConfigurationError } from '../errors.js';
import { addTopicHandler, subscribe } from './index.js';
import { createDebug } from '../debug.js';

const debug = createDebug('mqtt:statuses');

const statuses = {};

export function init() {
    config.devices.forEach(function (device) {
        const statusConfig = device?.statuses || {};
        const deviceId = device.id;

        Object.entries(statusConfig).forEach(function ([key, options]) {
            const fullKey = deviceId + '/' + key;
            const propertyType = options?.type;

            switch (propertyType) {
                case 'mqtt':
                    const inputConfig = options?.input;
                    const topic = inputConfig?.topic;

                    if (typeof topic === 'undefined') {
                        throw new InvalidConfigurationError('No topic provided for key ' + fullKey);
                    }

                    const inputType = inputConfig?.type;

                    if (!['literal', 'json'].includes(inputType)) {
                        throw new InvalidConfigurationError('Invalid input type for key ' + fullKey + ': ' +
                            inputType);
                    }

                    const outputConfig = options?.output;
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
                    // TODO
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

    if (value === getStatusValue(deviceId, key)) {
        debug('Skipping', fullKey, 'because it\s already set to', value);
        return;
    }

    statuses[deviceId][key] = value;
    // TODO: publish change notification
    debug('Set', fullKey, 'to', value);
}
