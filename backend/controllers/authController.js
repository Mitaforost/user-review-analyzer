const { User } = require('../models');

// LOGIN ROUTE
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Validate the password (assuming passwords are stored securely with hashing, modify accordingly)
        if (user.password !== password) {  // Ideally, use a hashed comparison here
            return res.status(401).json({ error: "Invalid credentials" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role_id: user.role_id
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// REGISTER ROUTE
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Create a new user (Note: Make sure passwords are hashed before saving)
        const newUser = await User.create({
            username,
            password, // In a real app, hash the password here before saving
            email,
            role_id: 2  // Assuming the default role is 3
        });

        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { login, register };
