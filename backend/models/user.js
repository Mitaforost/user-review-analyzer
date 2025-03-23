const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
        password: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
        role_id: { type: DataTypes.INTEGER, defaultValue: 2 },
        created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    }, { tableName: 'users', timestamps: false });
};
