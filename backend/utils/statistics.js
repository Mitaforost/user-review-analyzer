const { Review, ReviewKeyword, Keyword, ReviewStatistic } = require('../models');

async function updateStatistics() {
    try {
        const averageRating = await Review.aggregate('rating', 'avg', { plain: true });

        const mostPopularKeyword = await ReviewKeyword.findAll({
            attributes: ['keyword_id', [sequelize.fn('COUNT', sequelize.col('occurrences')), 'occurrenceCount']],
            group: ['keyword_id'],
            order: [[sequelize.fn('COUNT', sequelize.col('occurrences')), 'DESC']],
            limit: 1,
            include: { model: Keyword, attributes: ['keyword'] }
        });

        const mostPopularKeywordText = mostPopularKeyword.length
            ? mostPopularKeyword[0].Keyword.keyword
            : null;

        const statistics = await ReviewStatistic.findByPk(1);
        if (statistics) {
            await statistics.update({
                average_rating: averageRating,
                most_popular_keyword: mostPopularKeywordText,
                last_updated: Sequelize.NOW,
            });
        } else {
            await ReviewStatistic.create({
                average_rating: averageRating,
                most_popular_keyword: mostPopularKeywordText,
            });
        }
    } catch (error) {
        console.error('Error updating statistics:', error);
        throw error;
    }
}

module.exports = { updateStatistics };
