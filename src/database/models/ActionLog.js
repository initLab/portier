import { DataTypes } from 'sequelize';

export const ActionLogModel = sequelize => sequelize.define('ActionLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
