function hasOverlappingRoles(userRoles, resourceRoles) {
    return resourceRoles.reduce((prev, curr) => prev || userRoles.includes(curr), false);
}

export function isAuthorized(user, actionConditions) {
    let result = false;

    if (actionConditions.hasOwnProperty('roles')) {
        const userRoles = user?.roles || [];
        result ||= hasOverlappingRoles(userRoles, actionConditions.roles);
    }

    return result;
}
