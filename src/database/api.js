import { EmptyResultError } from 'sequelize';
import { ActionLog, Application, User } from './index.js';

const findByPk = async (entity, id, fatal = true) => entity.findByPk(id, {
    rejectOnEmpty: fatal && new EmptyResultError('Entity not found: ' + entity.name),
});

export const getApplication = async id => findByPk(Application, id);
export const createOrUpdateApplication = async (fields = {}) => Application.upsert(fields);

export const getUser = async id => findByPk(User, id);
export const createOrUpdateUser = async (fields = {}) => User.upsert(fields);

export const createActionLog = async (fields = {}) => ActionLog.create(fields);
export const getActionLogs = async () => ActionLog.findAll();
