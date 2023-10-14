import { EmptyResultError } from 'sequelize';
import { ActionLog, Application, User } from './index.js';

const findByPk = async (entity, id, fatal = true) => entity.findByPk(id, {
    rejectOnEmpty: fatal && new EmptyResultError('Entity not found: ' + entity.name),
});

const upsert = async (entity, fields) => (await entity.upsert(fields))[0];

export const getApplication = async id => findByPk(Application, id);
export const createOrUpdateApplication = async (fields = {}) => upsert(Application, fields);

export const getUser = async id => findByPk(User, id);
export const createOrUpdateUser = async (fields = {}) => upsert(User, fields);

export const createActionLog = async (fields = {}) => ActionLog.create(fields);
export const getActionLogs = async (offset = null, limit = null) => ActionLog.findAll({
    order: [['id', 'DESC']],
    offset,
    limit,
});
