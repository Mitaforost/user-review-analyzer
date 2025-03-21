const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const keywordRoutes = require('./routes/keywordRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());  // Parse JSON body data

// Test route
app.get('/', (req, res) => {
    res.send("API is working!");
});

// Use routes
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);
app.use('/keywords', keywordRoutes);
app.use('/sessions', sessionRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/users', userRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
