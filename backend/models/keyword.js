const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Keyword = sequelize.define('Keyword', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        keyword: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    }, {
        tableName: 'keywords',
        timestamps: false
    });

    Keyword.associate = (models) => {
        Keyword.hasMany(models.ReviewKeyword, { foreignKey: 'keyword_id' });
    };

    return Keyword;
};
