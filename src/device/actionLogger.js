import { createActionLog, createOrUpdateApplication, createOrUpdateUser } from '../database/api.js';
import { config } from '../config.js';
import { createDebug } from '../util/debug.js';

const debug = createDebug('device:actionLogger');

export async function logDeviceAction(req, device, action) {
    if (!config?.actionLogger?.createLogs) {
        debug('Skipped');
        return;
    }

    const {
        user: userFields,
        tokenInfo,
    } = req;

    await logDeviceActionInternal(userFields, tokenInfo.application, device, action);

    debug('Created new entry');
}

export async function logDeviceActionInternal(userFields, appFields, device, action, ts = null) {
    const user = await createOrUpdateUser(userFields);

    const application = await createOrUpdateApplication({
        id: appFields.id,
    });

    const createdAt = ts ? new Date(ts) : null;

    await createActionLog({
        deviceId: device.id,
        action,
        // TODO
        UserId: user.id ?? 21,
        ApplicationId: application.id,
        ...(createdAt ? {
            createdAt,
        } : {}),
    });
}
