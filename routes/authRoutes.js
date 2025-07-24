// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/check-username', authController.checkUsername);

router.post('/register-profile', authController.registerProfile);

module.exports = router;
