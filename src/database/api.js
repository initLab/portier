import { ActionLog, Application, User } from './index.js';

const upsert = async (entity, fields) => (await entity.upsert(fields))[0];

export const createOrUpdateApplication = async (fields = {}) => upsert(Application, fields);

export const createOrUpdateUser = async (fields = {}) => upsert(User, fields);

export const createActionLog = async (fields = {}) => ActionLog.create(fields);
export const getActionLogs = async (offset = null, limit = null) => ActionLog.findAll({
    order: [['createdAt', 'DESC']],
    offset,
    limit,
    include: [Application, User],
});
