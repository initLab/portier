import config from '../config.json' assert { type: 'json' };

config.doors = Object.entries(config?.doors || []).map(([id, door]) => ({
    id,
    ...door,
}));

export { config };
