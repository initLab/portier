import { createDebug } from '../debug.js';
import { Sequelize } from 'sequelize';
import { ApplicationModel } from './models/Application.js';
import { UserModel } from './models/User.js';
import { seed } from './seed.js';
import { ActionLogModel } from './models/ActionLog.js';
import { config } from '../config.js';

let sequelize, ActionLog, Application, User;

const debug = createDebug('database');

export async function init(syncOptions = {}, runSeeder = false) {
    debug('Initializing...');

    sequelize = new Sequelize(config.database.uri, {
        define: {
            freezeTableName: true,
        },
        logging: false,
    });

    const notNullOptions = {
        foreignKey: {
            allowNull: false,
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
    };

    ActionLog = ActionLogModel(sequelize);
    Application = ApplicationModel(sequelize);
    User = UserModel(sequelize);

    Application.hasMany(ActionLog, notNullOptions);
    ActionLog.belongsTo(Application);

    User.hasMany(ActionLog, notNullOptions);
    ActionLog.belongsTo(User);

    await sequelize.sync(syncOptions);

    if (runSeeder) {
        await seed();
    }

    debug('Initialized');
}

export {
    sequelize,
    ActionLog,
};
