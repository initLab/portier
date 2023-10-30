import { send } from '../mqtt/notification.js';
import { getDevice } from '../device/index.js';

export function sendNotification(deviceId, key, value, oldValue) {
    const device = getDevice(deviceId);
    const topicSuffix = '/deviceStatus/' + device.id + '/' + key;
    const publicMessage = {
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

    send(topicSuffix, publicMessage, null, true);
}
