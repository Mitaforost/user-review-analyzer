module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Session', {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        session_token: { type: DataTypes.TEXT, unique: true, allowNull: false },
        expires_at: { type: DataTypes.DATE, allowNull: false },
    }, { tableName: 'sessions', timestamps: false });
};
