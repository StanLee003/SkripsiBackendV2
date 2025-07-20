// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/authMiddleware');

router.use(isAuth);

// Impor controller yang akan kita buat
const { getChatHistory, searchMessages } = require('../controllers/messageController');

// Definisikan rute untuk mengambil riwayat chat berdasarkan ID chat
// GET /api/messages/:chatId
router.get('/:chatId', getChatHistory);

router.get('/:chatId/search', searchMessages);

module.exports = router;