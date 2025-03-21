const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Review', {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
        review_text: { type: DataTypes.TEXT, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    }, { tableName: 'reviews', timestamps: false });
};
