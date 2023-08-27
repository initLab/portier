export function isAuthorised(userRoles, resourceRoles) {
    return resourceRoles.reduce((prev, curr) => prev || userRoles.includes(curr), false);
}
