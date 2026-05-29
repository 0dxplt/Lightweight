const express = require('express');
const router = express.Router();
const controller = require('../controllers/moderatori.controller');

router.get('/', controller.getAllModerators);

module.exports = router;