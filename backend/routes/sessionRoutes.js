const express = require('express');
const {
    createSession,
    getSessions,
    deleteSession
} = require('../controllers/sessionController');
const router = express.Router();

router.post('/', createSession);
router.get('/', getSessions);
router.delete('/:id', deleteSession);

module.exports = router;
