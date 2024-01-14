import { DataTypes } from 'sequelize';

export const UserModel = sequelize => sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
    },
    announce_my_presence: {
        type: DataTypes.BOOLEAN,
    },
});
