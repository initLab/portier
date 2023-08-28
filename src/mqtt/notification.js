import { publish } from './index.js';
import { config } from '../config.js';

export function sendNotification(user, door, action) {
    const notificationConfig = config?.mqtt?.notifications;

    if (!notificationConfig || !notificationConfig.hasOwnProperty('topic')) {
        return;
    }

    const topic = notificationConfig.topic + '/' + door.id + '/' + action;
    const message = JSON.stringify({
        ts: Date.now(),
        door: {
            id: door.id,
            name: door.name,
        },
        action,
        user: user.announce_my_presence ? {
            id: user.id,
            name: user.name,
            url: user.url,
            twitter: user.twitter,
            username: user.username,
            github: user.github,
            jabber: user.jabber,
            picture: user.picture,
        } : null,
    });

    publish(topic, message);
}
