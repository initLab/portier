import { createActionLog, createOrUpdateApplication, createOrUpdateUser } from './api.js';
import { config } from '../config.js';
import { createDebug } from '../debug.js';

const debug = createDebug('actionLogger');

export async function logDoorAction(req, door, action) {
    if (!config?.actionLogger?.createLogs) {
        debug('Skipped');
        return;
    }

    const {
        user: userFields,
        tokenInfo,
    } = req;

    await logDoorActionInternal(userFields, tokenInfo.application, door, action);

    debug('Created new entry');
}

export async function logDoorActionInternal(userFields, appFields, door, action, ts = null) {
    const user = await createOrUpdateUser(userFields);

    const application = await createOrUpdateApplication({
        id: appFields.uid,
    });

    const createdAt = ts ? new Date(ts) : null;

    await createActionLog({
        doorId: door.id,
        action,
        UserId: user.id,
        ApplicationId: application.id,
        ...(createdAt ? {
            createdAt,
        } : {}),
    });
}
