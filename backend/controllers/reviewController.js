const { Review, ReviewKeyword, Keyword } = require('../models');

// Получение списка отзывов
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        return res.json(reviews);
    } catch (error) {
        console.error("Ошибка при получении отзывов:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Создание нового отзыва
const createReview = async (req, res) => {
    try {
        const { user_id, rating, review_text, keywords } = req.body;

        if (!user_id || !rating || !review_text) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const newReview = await Review.create({
            user_id,
            rating,
            review_text
        });

        // Обработка ключевых слов
        for (const keywordText of keywords) {
            let keyword = await Keyword.findOne({ where: { keyword: keywordText } });
            if (!keyword) {
                keyword = await Keyword.create({ keyword: keywordText });
            }
            await ReviewKeyword.create({
                review_id: newReview.id,
                keyword_id: keyword.id,
                occurrences: 1
            });
        }

        return res.status(201).json(newReview);
    } catch (error) {
        console.error("Ошибка при создании отзыва:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Редактирование отзыва
const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, review_text, keywords } = req.body;

        if (!rating || !review_text) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Отзыв не найден" });
        }

        await review.update({ rating, review_text });

        // Обновление ключевых слов (простой вариант: удаляем старые и добавляем новые)
        await ReviewKeyword.destroy({ where: { review_id: reviewId } });
        for (const keywordText of keywords) {
            let keyword = await Keyword.findOne({ where: { keyword: keywordText } });
            if (!keyword) {
                keyword = await Keyword.create({ keyword: keywordText });
            }
            await ReviewKeyword.create({
                review_id: reviewId,
                keyword_id: keyword.id,
                occurrences: 1
            });
        }

        return res.status(200).json(review);
    } catch (error) {
        console.error("Ошибка при редактировании отзыва:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Удаление отзыва
const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Отзыв не найден" });
        }

        await review.destroy();
        return res.status(200).json({ message: "Отзыв успешно удален" });
    } catch (error) {
        console.error("Ошибка при удалении отзыва:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
};
