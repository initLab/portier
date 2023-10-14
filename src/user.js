function hasOverlappingRoles(userRoles, resourceRoles) {
    return resourceRoles.reduce((prev, curr) => prev || userRoles.includes(curr), false);
}

export function isAuthorized(user, actionConditions) {
    let result = false;

    if (actionConditions.hasOwnProperty('roles')) {
        result ||= hasOverlappingRoles(user?.roles || [], actionConditions.roles);
    }

    if (actionConditions.hasOwnProperty('usernames')) {
        result ||= actionConditions.usernames.includes(user?.username || '');
    }

    return result;
}
