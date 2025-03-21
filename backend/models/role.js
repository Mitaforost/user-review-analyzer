module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Role', {
        role_name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    }, { tableName: 'roles', timestamps: false });
};
