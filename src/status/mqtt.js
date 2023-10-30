import { InvalidConfigurationError } from '../errors.js';
import { addTopicHandler, subscribe } from '../mqtt/index.js';
import { mapAndSetValue, parseValue } from './index.js';

export function initStatus(deviceId, key, options) {
    const fullKey = deviceId + '/' + key;
    const inputConfig = options?.input;
    const outputConfig = options?.output;
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
        mapAndSetValue(deviceId, key, parsedValue, outputConfig);
    });

    subscribe(topic);
}
