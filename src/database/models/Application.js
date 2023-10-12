import { DataTypes } from 'sequelize';

export const ApplicationModel = sequelize => sequelize.define('Application', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
