import { createActionLog, createOrUpdateApplication, createOrUpdateUser } from './api.js';
import { config } from '../config.js';

export async function logDoorAction(req, door, action) {
    if (!config?.database?.logActions) {
        return;
    }

    const {
        user: userFields,
        tokenInfo,
    } = req;

    const user = await createOrUpdateUser(userFields);

    const application = await createOrUpdateApplication({
        id: tokenInfo.application.uid,
    });

    await createActionLog({
        doorId: door.id,
        action,
        UserId: user.id,
        ApplicationId: application.id,
    });
}
