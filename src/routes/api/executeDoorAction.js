import { executeDeviceAction } from './executeDeviceAction.js';

export const executeDoorAction = async (req, res) => executeDeviceAction({
    ...req,
    params: {
        ...req.params,
        deviceId: req.params.doorId,
    },
}, res);
