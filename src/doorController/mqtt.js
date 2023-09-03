import { publish } from '../mqtt/index.js';
import { InvalidConfigurationError, InvalidInputError, NotFoundError } from '../errors.js';

export function getMqttController(options) {
    function executeAction(actionName) {
        if (!options.hasOwnProperty('actions')) {
            throw new InvalidConfigurationError('No actions defined in MQTT controller options');
        }

        if (!options.actions?.hasOwnProperty(actionName)) {
            throw new NotFoundError('Action ' + actionName + ' not defined in MQTT controller options');
        }

        const actionParams = options.actions[actionName];

        for (const key of ['topic', 'value']) {
            if (!actionParams.hasOwnProperty(key)) {
                throw new InvalidInputError('Missing required parameter ' + key + ' for action ' + actionName);
            }
        }

        publish(actionParams.topic, actionParams.value);
    }

    function getStatus(statusName) {
        // TODO
    }

    return {
        executeAction,
        getStatus,
    };
}
