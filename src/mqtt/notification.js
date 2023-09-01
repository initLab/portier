import { publish } from './index.js';
import { config } from '../config.js';

export function sendNotification(user, door, action) {
    const notificationConfig = config?.mqtt?.notifications;

    if (!notificationConfig || !notificationConfig.hasOwnProperty('topic')) {
        return;
    }

    const topicSuffix = '/doorAction/' + door.id + '/' + action;
    const privateMessage = {
        ts: Date.now(),
        door: {
            id: door.id,
            name: door.name,
        },
        action,
        user: {
            id: user.id,
            name: user.name,
            url: user.url,
            twitter: user.twitter,
            username: user.username,
            github: user.github,
            jabber: user.jabber,
            picture: user.picture,
        },
    };
    const publicMessage = {
        ...privateMessage,
        user: user.announce_my_presence ? privateMessage.user : null,
    };

    publish(notificationConfig.privateTopic + topicSuffix, JSON.stringify(privateMessage));
    publish(notificationConfig.publicTopic + topicSuffix, JSON.stringify(publicMessage));
}
