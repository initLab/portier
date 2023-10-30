import { send } from '../mqtt/notification.js';

export function sendNotification(req, device, action) {
    const {
        user,
        tokenInfo,
    } = req;

    const topicSuffix = '/deviceAction/' + device.id + '/' + action;
    const privateMessage = {
        ts: Date.now(),
        device: {
            id: device.id,
            name: device.name,
            type: device.type,
            number: device.number,
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

    send(topicSuffix, publicMessage, privateMessage);
}
