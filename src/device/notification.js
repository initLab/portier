import { send } from '../mqtt/notification.js';

export function sendNotification(req, device, action) {
    const {
        user,
        tokenInfo,
    } = req;

    const topicSuffix = '/device/' + device.id + '/action/' + action;
    const application = tokenInfo.application;
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
        application: {
            id: application.id,
            name: application.name,
        },
    };
    const publicMessage = {
        ...privateMessage,
        user: user.announce_my_presence ? privateMessage.user : null,
    };

    send(topicSuffix, !!device.public ? publicMessage : null, privateMessage);
}
