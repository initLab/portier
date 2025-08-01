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
            group: device.group,
            number: device.number,
            public: !!device.public,
        },
        action,
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
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

    send(topicSuffix, device.public ? publicMessage : null, privateMessage);
}
