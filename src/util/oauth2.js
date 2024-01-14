import { config } from '../config.js';
import { FetchError } from '../errors.js';
import { createDebug } from './debug.js';
import { getApplication } from '../database/api.js';

let tokenCache = {};
const oauth2Config = config.oauth2;
const expirationPropertyName = 'expires_at';

const debug = createDebug('util:oauth2');

export function init() {
    setInterval(cleanupExpiredTokens, 60000);
}

const maskToken = token => token.substring(0, 8) + '...';

const isTokenExpired = tokenInfo => tokenInfo[expirationPropertyName] < Date.now();

const fetchTokenInfo = async (token) =>
    authenticatedFetch(oauth2Config.baseUrl + oauth2Config.tokenInfoPath, token);

export const fetchResourceOwner = async (token) =>
    authenticatedFetch(oauth2Config.baseUrl + oauth2Config.resourceOwnerPath, token);

function deleteToken(token) {
    debug('Deleting token from cache', maskToken(token));
    delete tokenCache[token];
}

function cleanupExpiredTokens() {
    const expiredTokens = Object.entries(tokenCache).filter(([_, tokenInfo]) =>
        isTokenExpired(tokenInfo)
    ).map(([token]) => token);

    for (const token of expiredTokens) {
        deleteToken(token);
    }
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

export async function getTokenInfo(token) {
    if (tokenCache.hasOwnProperty(token)) {
        const tokenInfo = tokenCache[token];

        if (!isTokenExpired(tokenInfo)) {
            debug('Token info retrieved from cache', maskToken(token));
            return tokenInfo;
        }

        deleteToken(token);
    }

    const tokenInfo = await fetchTokenInfo(token);

    debug('Token info stored in cache', maskToken(token));

    const applicationId = tokenInfo.application.uid;

    tokenInfo.application = {
        id: applicationId,
    };

    try {
        tokenInfo.application = (await getApplication(applicationId)).toJSON();
    }
    catch {}

    return tokenCache[token] = {
        ...tokenInfo,
        [expirationPropertyName]: Date.now() + tokenInfo.expires_in * 1000,
    };
}
