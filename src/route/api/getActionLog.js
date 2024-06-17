import { isAuthorized } from '../../user.js';
import { createDebug } from '../../util/debug.js';
import { config } from '../../config.js';
import { getActionLogs } from '../../database/api.js';

const debug = createDebug('route:api:getActionLog');

export async function getActionLog(req, res) {
    if (!isAuthorized(req.user, config?.actionLogger?.readLogs ?? {})) {
        debug('Unauthorized');
        return res.status(403).end();
    }

    const {
        offset,
        limit,
    } = req.params;

    debug('Successful');

    res.json(await getActionLogs(
        parseInt(offset, 10) || 0,
        parseInt(limit, 10) || 50,
    ));
}
