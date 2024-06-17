import config from '../config.json' assert { type: 'json' };
import passportProfile from '../passport-profile.json' assert { type: 'json' };

config.devices = Object.entries(config?.devices || {}).map(([id, device]) => ({
    id,
    ...device,
}));

config.passport = {
    ...config.passport,
    authorization: {
        ...config.passport.authorization,
        profile: passportProfile,
    },
};

export { config };
