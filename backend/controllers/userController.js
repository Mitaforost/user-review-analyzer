const { User, Role } = require('../models');

// Получение списка пользователей
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Role, attributes: ['role_name'] }]
        });
        return res.json(users);
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Создание нового пользователя
const createUser = async (req, res) => {
    try {
        const { username, email, password_hash, role_id } = req.body;

        if (!username || !email || !password_hash) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const newUser = await User.create({
            username,
            email,
            password_hash,
            role_id: role_id || 2  // Default role is user
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Редактирование пользователя
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password_hash, role_id } = req.body;

        if (!username || !email || !password_hash) {
            return res.status(400).json({ error: 'Не все данные переданы' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        await user.update({ username, email, password_hash, role_id });
        return res.status(200).json(user);
    } catch (error) {
        console.error("Ошибка при редактировании пользователя:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        await user.destroy();
        return res.status(200).json({ message: "Пользователь успешно удален" });
    } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
        return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
