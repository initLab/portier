import { publish } from '../mqtt.js';

export function getMqttController(options) {
    function executeAction(actionName) {
        if (!options.hasOwnProperty('actions')) {
            throw new Error('No actions defined in MQTT controller options');
        }

        if (!options.actions?.hasOwnProperty(actionName)) {
            throw new Error('Action ' + actionName + ' not defined in MQTT controller options');
        }

        const actionParams = options.actions[actionName];

        for (const key of ['topic', 'value']) {
            if (!actionParams.hasOwnProperty(key)) {
                throw new Error('Missing required parameter ' + key + ' for action ' + actionName);
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
