export function getUser() {
    // TODO

    return {
        language: 'en',
        roles: ['trusted_member'],
    };
}

export function isAuthorised(userRoles, resourceRoles) {
    return resourceRoles.reduce((prev, curr) => prev || userRoles.includes(curr), false);
}
