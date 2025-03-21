module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ReviewKeyword', {
        review_id: { type: DataTypes.INTEGER, allowNull: false },
        keyword_id: { type: DataTypes.INTEGER, allowNull: false },
        occurrences: { type: DataTypes.INTEGER, defaultValue: 1 },
    }, {
        tableName: 'review_keywords',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['review_id', 'keyword_id']
            }
        ]
    });
};
