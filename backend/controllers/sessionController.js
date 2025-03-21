const { Session, User } = require('../models');
const uuid = require('uuid');

// Создание новой сессии
const createSession = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const sessionToken = uuid.v4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Сессия действует 1 час

        const newSession = await Session.create({
            user_id,
            session_token: sessionToken,
            expires_at: expiresAt
        });

        return res.status(201).json(newSession);
    } catch (error) {
        console.error("Ошибка при создании сессии:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Получение списка сессий
const getSessions = async (req, res) => {
    try {
        const sessions = await Session.findAll();
        return res.json(sessions);
    } catch (error) {
        console.error("Ошибка при получении сессий:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Удаление сессии
const deleteSession = async (req, res) => {
    try {
        const sessionId = req.params.id;

        const session = await Session.findByPk(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Сессия не найдена" });
        }

        await session.destroy();
        return res.status(200).json({ message: "Сессия успешно удалена" });
    } catch (error) {
        console.error("Ошибка при удалении сессии:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

module.exports = {
    createSession,
    getSessions,
    deleteSession
};
