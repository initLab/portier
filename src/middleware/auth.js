import { fetchResourceOwner, getTokenInfo } from '../oauth2.js';
import { FetchError } from '../errors.js';

export function auth() {
    const authorizationType = 'Bearer';

    return async function(req, res, next) {
        const authHeader = req.headers?.authorization;

        if (typeof authHeader !== 'string' || !authHeader.startsWith(authorizationType + ' ')) {
            return next();
        }

        const bearerToken = authHeader.substring(authorizationType.length + 1);

        try {
            req.tokenInfo = await getTokenInfo(bearerToken);
            req.user = await fetchResourceOwner(bearerToken);
            next();
        }
        catch (ex) {
            if (ex instanceof FetchError) {
                return res.status(ex.status).end();
            }

            throw ex;
        }
    };
}
