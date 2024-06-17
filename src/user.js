function hasOverlappingRoles(userRoles, resourceRoles) {
    return resourceRoles.reduce((prev, curr) => prev || userRoles.includes(curr), false);
}

export function isAuthorized(user, actionConditions) {
    let result = false;
    const userRoles = Object.keys(user?.['urn:zitadel:iam:org:project:roles'] || {});

    if (Object.hasOwn(actionConditions, 'roles')) {
        result ||= hasOverlappingRoles(userRoles, actionConditions.roles);
    }

    if (Object.hasOwn(actionConditions, 'usernames')) {
        result ||= actionConditions.usernames.includes(user?.username ?? '');
    }

    return result;
}
