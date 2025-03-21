const { ReviewStatistic } = require('../models');

// Получение статистики отзывов (доступно только администратору)
const getStatistics = async (req, res) => {
    try {
        const statistics = await ReviewStatistic.findOne({ where: { id: 1 } });
        return res.json(statistics);
    } catch (error) {
        console.error("Ошибка при получении статистики:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

module.exports = { getStatistics };
