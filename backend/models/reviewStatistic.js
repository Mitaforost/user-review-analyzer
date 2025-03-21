const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ReviewStatistic', {
        average_rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.00 },
        most_popular_keyword: { type: DataTypes.STRING(50) },
        last_updated: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    }, { tableName: 'review_statistics', timestamps: false });
};
