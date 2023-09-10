import { publish } from './index.js';
import { config } from '../config.js';

export function sendNotification(req, door, action) {
    const notificationConfig = config?.mqtt?.notifications;

    if (!notificationConfig) {
        return;
    }

    const {
        user,
        tokenInfo,
    } = req;

    const topicSuffix = '/doorAction/' + door.id + '/' + action;
    const privateMessage = {
        ts: Date.now(),
        door: {
            id: door.id,
            name: door.name,
            number: door.number,
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
            announce_my_presence: user.announce_my_presence,
        },
        application: tokenInfo.application,
    };
    const publicMessage = {
        ...privateMessage,
        user: user.announce_my_presence ? privateMessage.user : null,
    };

    if (notificationConfig.hasOwnProperty('privateTopic')) {
        publish(notificationConfig.privateTopic + topicSuffix, JSON.stringify(privateMessage));
    }

    if (notificationConfig.hasOwnProperty('publicTopic')) {
        publish(notificationConfig.publicTopic + topicSuffix, JSON.stringify(publicMessage));
    }
}
