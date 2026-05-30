const express = require('express');
const router = express.Router();
const controller = require('../controllers/users-img.controller');

router.get('/', controller.getAvatar);

module.exports = router;