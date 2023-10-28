import config from '../config.json' assert { type: 'json' };

config.devices = Object.entries(config?.devices || {}).map(([id, device]) => ({
    id,
    ...device,
}));

export { config };
