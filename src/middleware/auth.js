import { config } from '../config.js';

export function auth() {
    const oauth2Config = config.oauth2;

    return async function(req, res, next) {
        const authHeader = req.headers?.authorization;

        if (typeof authHeader !== 'string') {
            return next();
        }

        const url = oauth2Config.baseUrl + oauth2Config.resourceOwnerPath;

        const userResponse = await fetch(url, {
            headers: new Headers({
                Authorization: authHeader,
            }),
        });

        if (!userResponse.ok) {
            return res.status(userResponse.status).end();
        }

        req.user = await userResponse.json();
        next();
    };
}
