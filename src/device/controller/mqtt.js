import { publish } from '../../mqtt/index.js';
import { InvalidConfigurationError, NotFoundError } from '../../errors.js';

export function getMqttController(options) {
    function executeAction(actionName) {
        if (!Object.hasOwn(options, 'actions')) {
            throw new InvalidConfigurationError('No actions defined in MQTT controller options');
        }

        if (!Object.hasOwn(options.actions, actionName)) {
            throw new NotFoundError('Action ' + actionName + ' not defined in MQTT controller options');
        }

        const actionParams = options?.actions[actionName];

        for (const key of ['topic', 'value']) {
            if (!Object.hasOwn(actionParams, key)) {
                throw new InvalidConfigurationError('Missing required parameter ' + key + ' for action ' + actionName);
            }
        }

        publish(actionParams.topic, actionParams.value);
    }

    return {
        executeAction,
    };
}
