import { publish } from './index.js';
import { config } from '../config.js';
import { createDebug } from '../util/debug.js';

const debug = createDebug('mqtt:notification');

export function send(topicSuffix, publicMessage, privateMessage, retain = false) {
    const notificationConfig = config?.mqtt?.notifications;

    if (!notificationConfig) {
        debug('Skipped, no notification config');
        return;
    }

    const notifyPrivate = Object.hasOwn(notificationConfig, 'privateTopic');
    const notifyPublic = Object.hasOwn(notificationConfig, 'publicTopic');

    if (!notifyPrivate && !notifyPublic) {
        debug('Skipped, no topics in notification config');
        return;
    }

    const opts = {
        retain,
    };

    if (notifyPrivate && privateMessage) {
        const privateTopic = notificationConfig.privateTopic + topicSuffix;
        publish(privateTopic, privateMessage, opts);
        debug('Sent to private topic', privateTopic);
    }

    if (notifyPublic && publicMessage) {
        const publicTopic = notificationConfig.publicTopic + topicSuffix;
        publish(publicTopic, publicMessage, opts);
        debug('Sent to public topic', publicTopic);
    }
}
