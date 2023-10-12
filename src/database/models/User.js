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
    url: {
        type: DataTypes.STRING,
    },
    twitter: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
    },
    github: {
        type: DataTypes.STRING,
    },
    jabber: {
        type: DataTypes.STRING,
    },
    picture: {
        type: DataTypes.STRING,
    },
    announce_my_presence: {
        type: DataTypes.BOOLEAN,
    },
});
