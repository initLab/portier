import { send } from '../mqtt/notification.js';
import { getDevice } from '../device/index.js';

export function sendNotification(deviceId, key, value, oldValue) {
    if (value === null) {
        return;
    }

    const device = getDevice(deviceId);
    const topicSuffix = '/device/' + device.id + '/status/' + key;
    const privateMessage = {
        ts: Date.now(),
        device: {
            id: device.id,
            name: device.name,
            type: device.type,
            number: device.number,
        },
        statusKey: key,
        value,
        oldValue
    };

    send(topicSuffix, !!device.public ? privateMessage : null, privateMessage, true);
}
