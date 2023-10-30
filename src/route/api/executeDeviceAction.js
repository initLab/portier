import { isAuthorized } from '../../user.js';
import { getController } from '../../device/controller/index.js';
import { sendNotification } from '../../device/notification.js';
import { InvalidConfigurationError, NotFoundError } from '../../errors.js';
import { getDevice } from '../../device/index.js';
import { logDeviceAction } from '../../device/actionLogger.js';
import { createDebug } from '../../util/debug.js';

const debug = createDebug('route:api:executeDeviceAction');

export async function executeDeviceAction(req, res) {
    if (!req.user) {
        debug('Unauthenticated');
        return res.status(403).end();
    }

    const {
        deviceId,
        action,
    } = req.params;

    let device;

    try {
        device = getDevice(deviceId);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            debug('Device not found', deviceId);
            return res.status(404).end();
        }

        throw err;
    }

    let controller;

    try {
        controller = getController(device);
    }
    catch (err) {
        if (err instanceof InvalidConfigurationError) {
            debug('Controller not found');
            return res.status(500).end();
        }

        throw err;
    }

    if (!isAuthorized(req.user, device.actions?.[action])) {
        debug('Unauthorized');
        return res.status(403).end();
    }

    // user is authorized to perform action
    try {
        await controller.executeAction(action);
    }
    catch (err) {
        if (err instanceof NotFoundError) {
            debug('Action not found');
            return res.status(404).end();
        }
        if (err instanceof InvalidConfigurationError) {
            debug('Invalid actions configuration');
            return res.status(500).end();
        }

        throw err;
    }

    debug('Action', action, 'on device', device.id, 'successful');

    await logDeviceAction(req, device, action);
    await sendNotification(req, device, action);

    res.status(204).end();
}
