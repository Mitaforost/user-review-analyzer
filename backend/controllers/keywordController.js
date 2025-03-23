const { Keyword, ReviewKeyword } = require('../models');

// Получение списка ключевых слов с частотностью
const getKeywords = async (req, res) => {
    try {
        const keywords = await Keyword.findAll({
            include: [{
                model: ReviewKeyword,
                attributes: ['occurrences']
            }]
        });

        const keywordData = keywords.map(keyword => ({
            id: keyword.id,
            keyword: keyword.keyword,
            occurrences: keyword.ReviewKeywords.reduce((sum, reviewKeyword) => sum + reviewKeyword.occurrences, 0)
        }));

        return res.json(keywordData);
    } catch (error) {
        console.error("Ошибка при получении ключевых слов:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Остальные функции остаются без изменений
const createKeyword = async (req, res) => {
    try {
        const { keyword } = req.body;

        if (!keyword) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const newKeyword = await Keyword.create({ keyword });
        return res.status(201).json(newKeyword);
    } catch (error) {
        console.error("Ошибка при создании ключевого слова:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

const updateKeyword = async (req, res) => {
    try {
        const keywordId = req.params.id;
        const { keyword } = req.body;

        if (!keyword) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const existingKeyword = await Keyword.findByPk(keywordId);
        if (!existingKeyword) {
            return res.status(404).json({ error: "Ключевое слово не найдено" });
        }

        await existingKeyword.update({ keyword });
        return res.status(200).json(existingKeyword);
    } catch (error) {
        console.error("Ошибка при редактировании ключевого слова:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

const deleteKeyword = async (req, res) => {
    try {
        const keywordId = req.params.id;

        const existingKeyword = await Keyword.findByPk(keywordId);
        if (!existingKeyword) {
            return res.status(404).json({ error: "Ключевое слово не найдено" });
        }

        await existingKeyword.destroy();
        return res.status(200).json({ message: "Ключевое слово успешно удалено" });
    } catch (error) {
        console.error("Ошибка при удалении ключевого слова:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

module.exports = {
    getKeywords,
    createKeyword,
    updateKeyword,
    deleteKeyword
};
