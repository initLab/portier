import { config } from './config.js';
import { FetchError } from './errors.js';
import { createDebug } from './debug.js';

let tokenCache = {};
const oauth2Config = config.oauth2;
const expirationPropertyName = 'expires_at';

const debug = createDebug('oauth2');

export function init() {
    setInterval(cleanupExpiredTokens, 60000);
}

function isTokenExpired(tokenInfo) {
    return tokenInfo[expirationPropertyName] < Date.now();
}

function cleanupExpiredTokens() {
    tokenCache = Object.fromEntries(Object.entries(tokenCache).filter(([_, tokenInfo]) =>
        !isTokenExpired(tokenInfo)
    ));
}

async function authenticatedFetch(url, bearerToken) {
    debug('Requesting', url);

    const response = await fetch(url, {
        headers: new Headers({
            Authorization: 'Bearer ' + bearerToken,
        }),
    });

    if (!response.ok) {
        debug('Request to', url, 'failed with', response.status, response.statusText);
        throw new FetchError(response.statusText, response.status);
    }

    debug('Request to', url, 'successful');

    return response.json();
}

async function fetchTokenInfo(token) {
    return authenticatedFetch(oauth2Config.baseUrl + oauth2Config.tokenInfoPath, token);
}

export async function fetchResourceOwner(token) {
    return authenticatedFetch(oauth2Config.baseUrl + oauth2Config.resourceOwnerPath, token);
}

export async function getTokenInfo(token) {
    const maskedToken = token.substring(0, 8) + '...';

    if (tokenCache.hasOwnProperty(token)) {
        const tokenInfo = tokenCache[token];

        if (!isTokenExpired(tokenInfo)) {
            debug('Token info retrieved from cache', maskedToken);
            return tokenInfo;
        }

        debug('Deleting expired token', token);
        delete tokenCache[token];
    }

    const tokenInfo = await fetchTokenInfo(token);

    debug('Token info stored in cache', maskedToken);

    return tokenCache[token] = {
        ...tokenInfo,
        [expirationPropertyName]: Date.now() + tokenInfo.expires_in * 1000,
    };
}
