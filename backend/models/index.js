const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');
const sequelize = new Sequelize({
    dialect: config.dialect,
    host: config.host,
    username: config.username,
    password: config.password,
    database: config.database,
    logging: config.logging
});

// Import models
const Role = require('./role')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);
const Keyword = require('./keyword')(sequelize, DataTypes);
const ReviewKeyword = require('./reviewKeyword')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const ReviewStatistic = require('./reviewStatistic')(sequelize, DataTypes);

// Define associations
User.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'SET NULL' });
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'SET NULL' });

Review.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });

ReviewKeyword.belongsTo(Review, { foreignKey: 'review_id', onDelete: 'CASCADE' });
Review.hasMany(ReviewKeyword, { foreignKey: 'review_id', onDelete: 'CASCADE' });

ReviewKeyword.belongsTo(Keyword, { foreignKey: 'keyword_id', onDelete: 'CASCADE' });
Keyword.hasMany(ReviewKeyword, { foreignKey: 'keyword_id', onDelete: 'CASCADE' });

Session.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Define associations for ReviewStatistic if necessary
// For example, if ReviewStatistic is related to User or Review, define these associations here
// ReviewStatistic.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// User.hasMany(ReviewStatistic, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    Role,
    User,
    Review,
    Keyword,
    ReviewKeyword,
    Session,
    ReviewStatistic
};
