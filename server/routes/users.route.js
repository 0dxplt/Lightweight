const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

router.post('/change-password', controller.changePassword);

module.exports = router;