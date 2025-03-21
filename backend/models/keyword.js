module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Keyword', {
        keyword: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    }, { tableName: 'keywords', timestamps: false });
};
