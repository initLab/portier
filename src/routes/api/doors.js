import { doors } from '../../doors.js';

export function getDoors(req, res) {
    // TODO
    const userRoles = ['trusted_member'];
    const userLang = 'en';

    res.json(Object.entries(doors).map(([id, door]) => ({
        id,
        name: door.name[userLang],
        supported_actions: Object.entries(door.actions).filter(([_, actionOptions]) =>
            actionOptions.roles.reduce((prev, curr) => prev || userRoles.includes(curr), false)
        ).map(([action]) => action),
    })).filter(door => door.supported_actions.length > 0));
}
