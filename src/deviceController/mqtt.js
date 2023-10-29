import { publish } from '../mqtt/index.js';
import { InvalidConfigurationError, NotFoundError } from '../errors.js';

export function getMqttController(options) {
    async function executeAction(actionName) {
        if (!options.hasOwnProperty('actions')) {
            throw new InvalidConfigurationError('No actions defined in MQTT controller options');
        }

        if (!options.actions?.hasOwnProperty(actionName)) {
            throw new NotFoundError('Action ' + actionName + ' not defined in MQTT controller options');
        }

        const actionParams = options.actions[actionName];

        for (const key of ['topic', 'value']) {
            if (!actionParams.hasOwnProperty(key)) {
                throw new InvalidConfigurationError('Missing required parameter ' + key + ' for action ' + actionName);
            }
        }

        await publish(actionParams.topic, actionParams.value);
    }

    return {
        executeAction,
    };
}
