import { InvalidConfigurationError } from '../errors.js';
import { pubsub } from '../pubsub/index.js';
import { getStatusValue, mapAndSetValue, statusChangedEventName } from './index.js';

export function initStatus(deviceId, key, options) {
    const fullKey = deviceId + '/' + key;
    const inputConfig = options?.input;
    const outputConfig = options?.output;
    const statusLocked = inputConfig?.statusLocked;

    if (typeof statusLocked === 'undefined') {
        throw new InvalidConfigurationError('No statusLocked provided for key ' + fullKey);
    }

    const statusUnlocked = inputConfig?.statusUnlocked;

    if (typeof statusUnlocked === 'undefined') {
        throw new InvalidConfigurationError('No statusUnlocked provided for key ' + fullKey);
    }

    pubsub.on(statusChangedEventName, function({
       deviceId: eventDeviceId,
       key: eventKey,
       oldValue,
   }) {
        if (eventDeviceId !== deviceId || ![statusLocked, statusUnlocked].includes(eventKey)) {
            return;
        }

        const isLocked = getStatusValue(deviceId, statusLocked);
        const isUnlocked = getStatusValue(deviceId, statusUnlocked);
        const didLockedStatusChange = eventKey === statusLocked;
        const calculatedValue = calculateLockStatus(
            isLocked, isUnlocked, oldValue, didLockedStatusChange
        );
        mapAndSetValue(deviceId, key, calculatedValue, outputConfig);
    });
}

function calculateLockStatus(isLocked, isUnlocked, oldValue, didLockedStatusChange) {
    if (typeof isLocked !== 'boolean' || typeof isUnlocked !== 'boolean') {
        return 'unknown';
    }

    if (isLocked && isUnlocked) {
        return 'invalid';
    }

    if (isLocked && !isUnlocked) {
        return 'locked';
    }

    if (!isLocked && isUnlocked) {
        return 'unlocked';
    }

    if (oldValue !== true) {
        // repeated calling with no actual change
        return null;
    }

    return didLockedStatusChange ? 'unlocking' : 'locking';
}
