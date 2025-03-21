const express = require('express');
const {
    getKeywords,
    createKeyword,
    updateKeyword,
    deleteKeyword
} = require('../controllers/keywordController');
const router = express.Router();

router.get('/', getKeywords);
router.post('/', createKeyword);
router.put('/:id', updateKeyword);
router.delete('/:id', deleteKeyword);

module.exports = router;
